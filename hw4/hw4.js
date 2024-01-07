import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const accounts = new Map();

accounts.set("???", {
  name: "???",
  password: "1010101010",
});

const router = new Router();

router
  .get("/", (ctx) => {
    ctx.response.redirect('http://127.0.0.1:8000/public/');
  })
  .get("/account", (ctx) => {
    ctx.response.body = Array.from(accounts.values());
  })
  .post("/account/register", async (ctx) => {
    const body = ctx.request.body();
    if (body.type === "form") {
      const pairs = await body.value;
      const params = Object.fromEntries(pairs);
      const { name, password } = params;

      if (accounts.get(name)) {
        ctx.response.type = 'text/html';
        ctx.response.body = `<p>Username already exists</p><p><a href="http://127.0.0.1:8000/public/register.html">Retry registration</a></p>`;
      } else {
        accounts.set(name, { name, password });
        ctx.response.type = 'text/html';
        ctx.response.body = `<p>Registration (${name}, ${password}) successful</p><p><a href="http://127.0.0.1:8000/public/login.html">Login</a></p>`;
      }
    }
  })
  .get("/public/(.*)", async (ctx) => {
    const wpath = ctx.params[0];
    await send(ctx, wpath, {
      root: Deno.cwd() + "/public/",
      index: "index.html",
    });
  })
  .post("/account/login", async (ctx) => {
    const body = ctx.request.body();
    if (body.type === "form") {
      const pairs = await body.value;
      const params = Object.fromEntries(pairs);
      const { name, password } = params;

      if (accounts.get(name) && password === accounts.get(name).password) {
        ctx.response.type = 'text/html';
        ctx.response.body = `<p>Successfully signed in</p><p><a href="">Entering System</a></p>`;
      } else {
        ctx.response.type = 'text/html';
        ctx.response.body = `<p>Failed to login, please check your ID or password!</p><p><a href="http://127.0.0.1:8000/public/login.html">Log in again</a></p>`;
      }
    }
  });

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log('Server started at: http://127.0.0.1:8000');

await app.listen({ port: 8000 });
