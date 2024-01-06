import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use(async (ctx) => {
  console.log('path=', ctx.request.url.pathname);

  if (ctx.request.url.pathname === '/nqu') {
    ctx.response.body = `
      <html>
        <body>
          <a href="https://www.nqu.edu.tw/">金門大學網站</a>
        </body>
      </html>`;
  } else if (ctx.request.url.pathname === '/nqu/csie') {
    ctx.response.body = `
      <html>
        <body>
          <a href="https://csie.nqu.edu.tw/">金門大學資工系</a>
        </body>
      </html>`;
  } else if (ctx.request.url.pathname === '/to/nqu') {
    ctx.response.redirect('https://www.nqu.edu.tw/');
  } else if (ctx.request.url.pathname === '/to/nqu/csie') {
    ctx.response.redirect('https://csie.nqu.edu.tw/');
  } else {
    ctx.response.body = `
      <html>
        <body>
        </body>
      </html>`;
  }
});

console.log('start at : http://127.0.0.1:8000');
await app.listen({ port: 8000 });