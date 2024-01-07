import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';

const people = [
  { id: 0, name: 'Lylia', phone: '1212121212' }
];

const router = new Router();

router
  .get('/', list)
  .get('/person/new', add)
  .get('/person/:id', show)
  .post('/person', create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function list(ctx) {
  ctx.response.body = await render.list(people);
}

async function add(ctx) {
  ctx.response.body = await render.newPerson();
}

async function show(ctx) {
  const id = parseInt(ctx.params.id);
  const person = people.find(p => p.id === id);
  if (!person) {
    ctx.throw(404, 'Invalid person id');
  }
  ctx.response.body = await render.show(person);
}

async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const person = Object.fromEntries(pairs);
    const id = people.push(person) - 1;
    person.id = id;
    ctx.response.redirect('/');
  }
}

const port = 8000;
console.log(`Server run at http://127.0.0.1:${port}`);
await app.listen({ port });
