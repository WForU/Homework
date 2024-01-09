import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username  TEXT, email TEXT, password TEXT)");

const client = new Client();
await client.connect();

const router = new Router();

router
  .get('/', home)
  .get('/signup', signupui)
  .post('/signup', signup)
  .get('/login', loginui)
  .post('/login', login);

const app = new Application();
app.use(Session.initMiddleware());
app.use(router.routes());
app.use(router.allowedMethods());

async function sqlcmd(sql, args) {
  try {
    const result = await client.query(sql, ...args);
    return result.rows;
  } catch (error) {
    console.error('sqlcmd error:', error);
    throw new Error('Database error occurred');
  }
}

function userQuery(username) {
  return sqlcmd("SELECT id, username, email, password FROM users WHERE username=?", [username]);
}

async function parseFormBody(body) {
  const pairs = await body.value;
  const obj = {};
  for (const [key, value] of pairs) {
    obj[key] = value;
  }
  return obj;
}

async function signupui(ctx) {
  ctx.response.body = await render.signupui();
}

async function signup(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const user = await parseFormBody(body);
    const dbUsers = await userQuery(user.username);
    if (dbUsers.length === 0) {
      sqlcmd("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [user.username, user.email, user.password]);
      ctx.response.body = render.success();
    } else {
      ctx.response.body = render.fail();
    }
  }
}

async function loginui(ctx) {
  ctx.response.body = await render.loginui();
}

async function login(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const user = await parseFormBody(body);
    const dbUsers = await userQuery(user.username);
    const dbUser = dbUsers[0];
    if (dbUser && dbUser.password === user.password) {
      await ctx.state.session.set('user', dbUser);
      console.log('session.user=', await ctx.state.session.get('user'));
      ctx.response.body = render.success();
    } else {
      ctx.response.body = render.fail();
    }
  }
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
