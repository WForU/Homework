import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("Create New Table (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT)");

const router = new Router();

router
  .get('/', list)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function executeQuery(sql, params = []) {
  const result = [];
  for (const row of db.query(sql, params)) {
    result.push(row);
  }
  return result;
}

async function list(ctx) {
  try {
    const posts = await executeQuery("SELECT id, title, body FROM posts");
    console.log('list:posts=', posts);
    ctx.response.body = await render.list(posts);
  } catch (error) {
    ctx.throw(500, 'Internal Server Error');
  }
}

async function add(ctx) {
  ctx.response.body = await render.newPost();
}

async function show(ctx) {
  try {
    const pid = ctx.params.id;
    const posts = await executeQuery("SELECT id, title, body FROM posts WHERE id=?", [pid]);
    const post = posts[0];
    console.log('show:post=', post);
    if (!post) {
      ctx.throw(404, 'Invalid post id');
    }
    ctx.response.body = await render.show(post);
  } catch (error) {
    ctx.throw(500, 'Internal Server Error');
  }
}

async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    try {
      const pairs = await body.value;
      const post = Object.fromEntries(pairs);
      console.log('create:post=', post);
      db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [post.title, post.body]);
      ctx.response.redirect('/');
    } catch (error) {
      ctx.throw(500, 'Internal Server Error');
    }
  }
}

const port = parseInt(Deno.args[0]) || 8001;
console.log(`Server run at http://127.0.0.1:${port}`);
await app.listen({ port });
