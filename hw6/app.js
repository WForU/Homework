import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Session } from "https://deno.land/x/oak_sessions/mod.ts";

const db = new DB("blog.db");
db.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username  TEXT, email TEXT, password TEXT)"); 

const router = new Router();

router
  .get('/', home)
  .get('/signup', signupui)
  .post('/signup', signup)
  .get('/login', loginui)
  .post('/login', login)

const app = new Application();
app.use(Session.initMiddleware())
app.use(router.routes());
app.use(router.allowedMethods());

function sqlcmd(sql, arg1) {
    console.log('sql:', sql)
    try {
      var results = db.query(sql, arg1)
      console.log('sqlcmd: results=', results)
      return results
    } catch (error) {
      console.log('sqlcmd error: ', error)
      throw error
    }
  }

async function home(ctx) {
  ctx.response.body = await render.home
}

function userQuery(sql) {
  let list = []
  for (const [id, username, email, password] of sqlcmd(sql)) {
    list.push({id, username, email, password})
  }
  console.log('userQuery: list=', list)
  return list
}

async function parseFormBody(body) {
  const pairs = await body.value
  const obj = {}
  for (const [key, value] of pairs) {
    obj[key] = value
  }
  return obj
}

async function signupui(ctx) {
  ctx.response.body = await render.signupui();
}

async function signup(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var user = await parseFormBody(body)
    var dbUsers = userQuery(`SELECT id, username, email, password FROM users WHERE username='${user.username}'`)
    if (dbUsers.length === 0) {
      sqlcmd("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [user.username, user.email, user.password]);
      ctx.response.body = render.success()
    } else 
      ctx.response.body = render.fail()
  }
}

async function loginui(ctx) {
  ctx.response.body = await render.loginui();
}

async function login(ctx) {
  const body = ctx.request.body()
  if (body.type === "form") {
    var user = await parseFormBody(body)
    var dbUsers = userQuery(`SELECT id, username, email, password FROM users WHERE username='${user.username}'`) // userMap[user.username]
    var dbUser = dbUsers[0]
    if (dbUser.password === user.password) {
      ctx.state.session.set('user', user)
      console.log('session.user=', await ctx.state.session.get('user'))
      ctx.response.body = render.success()
    } else {
      ctx.response.body = render.fail()
    }
  }
}

console.log('Server run at http://127.0.0.1:8000')
await app.listen({ port: 8000 });