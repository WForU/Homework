import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, tel TEXT)");

const router = new Router();

router.get('/', list)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create)

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
    console.log('path=', ctx.request.url.pathname)
    if (ctx.request.url.pathname.startsWith("/public/")) {
      console.log('pass:', ctx.request.url.pathname)
      await send(ctx, ctx.request.url.pathname, {
        root: Deno.cwd(),
        index: "index.html",
      });  
    }
  });
  
  function query(sql) {
    let list = []
    for (const [id, name, tel] of db.query(sql)) {
      list.push({id, name, tel})
    }
    return list
  }
  
  async function list(ctx) {
    let posts = query("SELECT id, name, tel FROM posts")
    console.log('list:posts=', posts)
    ctx.response.body = await render.list(posts);
  }
  
  async function add(ctx) {
    ctx.response.body = await render.newPost();
  }
  
  async function show(ctx) {
    const pid = ctx.params.id;
    let posts = query(`SELECT id, name, tel FROM posts WHERE id=${pid}`)
    let post = posts[0]
    console.log('show:post=', post)
    if (!post) ctx.throw(404, 'invalid post id');
    ctx.response.body = await render.show(post);
  }
  
  async function create(ctx) {
    const tel = ctx.request.body()
    if (tel.type === "form") {
      const pairs = await tel.value
      const post = {}
      for (const [key, value] of pairs) {
        post[key] = value
      }
      console.log('create:post=', post)
      db.query("INSERT INTO posts (name, tel) VALUES (?, ?)", [post.name, post.tel]);
      ctx.response.redirect('/');
    }
  }

console.log('start at : http://127.0.0.1:8001')
await app.listen({ port: 8001 });