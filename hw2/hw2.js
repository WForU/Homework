import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/nqu", (context) => {
    context.response.body = `
    <html>
      <body>
        <a href="https://www.nqu.edu.tw/">金門大學網站</a>
      </body>
    </html>`;
  })
  .get("/nqu/csie/", (context) => {
    context.response.body = `
    <html>
      <body>
        <a href="https://csie.nqu.edu.tw/">金門大學資工系</a>
      </body>
    </html>`;
  })
  .get("/to/nqu/csie/", (context) => {
    context.response.redirect('https://csie.nqu.edu.tw/');
  })
  .get("/to/nqu/", (context) => {
    context.response.redirect('https://www.nqu.edu.tw/');
  })
  .get("/room/e320", (context) => {
    context.response.body = `
    <html>
      <body>
        <p>多媒體教室</p>
      </body>
    </html>`;
  })
  .get("/room/e319", (context) => {
    context.response.body = `
    <html>
      <body>
        <p>嵌入式實驗室</p>
      </body>
    </html>`;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8000');
await app.listen({ port: 8000 });