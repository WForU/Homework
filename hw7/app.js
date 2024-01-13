import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const posts = [
  { id: 0, title: 'dula', body: '1111111111' },
  { id: 1, title: 'peep', body: '1212121212' }
];

const router = new Router();

router
  .get('/', (ctx) => ctx.response.redirect('/public/index.html'))
  .get('/list', list)
  .get('/post/:id', show)
  .post('/post', create)
  .get('/public/(.*)', pub);

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.status = err.status || 500;
    ctx.response.body = err.message;
  }
});

async function pub(ctx) {
  console.log('path=', ctx.request.url.pathname);
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/`,
    index: "index.html",
  });
}

async function list(ctx) {
  ctx.response.type = 'application/json';
  ctx.response.body = posts;
}

async function show(ctx) {
  const id = ctx.params.id;
  const post = posts[id];
  if (!post) {
    ctx.throw(404, 'Invalid post id');
  }
  ctx.response.type = 'application/json';
  ctx.response.body = post;
}

async function create(ctx) {
  const { value } = ctx.request.body({ type: "json" });
  const post = await value;

  if (!post || typeof post.title !== 'string' || typeof post.body !== 'string') {
    ctx.throw(400, 'Invalid post data');
  }

  post.id = posts.length;
  posts.push(post);
  ctx.response.body = 'success';
  console.log('create: save =>', post);
}

console.log('Server run at http://127.0.0.1:8001');
await app.listen({ port: 8001 });
