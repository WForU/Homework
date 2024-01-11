import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("blog.db");
db.query("CREATE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, tel TEXT)");
db.query("CREATE contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, tel TEXT)");
db.query("CREATE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");

const users = new Map();

const router = new Router();

router
  .get('/', list)
  .get('/post/new', checkAuth, add)
  .get('/post/:id', show)
  .post('/post', checkAuth, create)
  .get('/contact/new', checkAuth, addContactForm)
  .post('/contact', checkAuth, createContact)
  .get('/contact/:id/delete', checkAuth, deleteContact)
  .get('/contact/search', checkAuth, searchContact)
  .get('/signup', signUpForm)
  .post('/signup', signUp)
  .get('/signin', signInForm)
  .post('/signin', signIn);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  console.log('path=', ctx.request.url.pathname);
  if (ctx.request.url.pathname.startsWith("/public/")) {
    console.log('pass:', ctx.request.url.pathname);
    await send(ctx, ctx.request.url.pathname, {
      root: Deno.cwd(),
      index: "index.html",
    });
  } else {
    await next();
  }
});

app.use(checkAuth);

function query(sql, params = []) {
  const list = [];
  for (const [id, name, tel] of db.query(sql, params)) {
    list.push({ id, name, tel });
  }
  return list;
}

async function list(ctx) {
  try {
    const posts = query("SELECT id, name, tel FROM posts");
    const contacts = query("SELECT id, name, tel FROM contacts");
    console.log('list:posts=', posts);
    console.log('list:contacts=', contacts);
    ctx.response.body = await render.list(posts, contacts);
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
    const posts = query("SELECT id, name, tel FROM posts WHERE id=?", [pid]);
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
      db.query("INSERT INTO posts (name, tel) VALUES (?, ?)", [post.name, post.tel]);
      ctx.response.redirect('/');
    } catch (error) {
      ctx.throw(500, 'Internal Server Error');
    }
  }
}

async function addContactForm(ctx) {
  ctx.response.body = await render.newContact();
}

async function createContact(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    try {
      const pairs = await body.value;
      const contact = Object.fromEntries(pairs);
      db.query("INSERT INTO contacts (name, tel) VALUES (?, ?)", [contact.name, contact.tel]);
      ctx.response.redirect('/');
    } catch (error) {
      ctx.throw(500, 'Internal Server Error');
    }
  }
}

async function deleteContact(ctx) {
  try {
    const cid = ctx.params.id;
    // To check if the contact exists
    const existingContact = query("SELECT id FROM contacts WHERE id=?", [cid]);
    if (existingContact.length === 0) {
      ctx.throw(404, 'Invalid contact id');
    }

    // To delete the contact
    db.query("DELETE FROM contacts WHERE id=?", [cid]);
    ctx.response.redirect('/');
  } catch (error) {
    ctx.throw(500, 'Internal Server Error');
  }
}

async function searchContact(ctx) {
  try {
    const query = ctx.request.url.searchParams.get('q');
    if (!query) {
      ctx.throw(400, 'Search query is missing');
    }

    const results = queryContacts(query);
    ctx.response.body = await render.searchResults(results);
  } catch (error) {
    ctx.throw(500, 'Internal Server Error');
  }
}

async function signUpForm(ctx) {
  ctx.response.body = await render.signUpForm();
}

async function signUp(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    try {
      const pairs = await body.value;
      const user = Object.fromEntries(pairs);
      if (users.has(user.username)) {
        ctx.throw(400, 'Username already exists');
      }
      db.query("INSERT INTO users (username, password) VALUES (?, ?)", [user.username, user.password]);
      ctx.response.redirect('/signin');
    } catch (error) {
      ctx.throw(500, 'Internal Server Error');
    }
  }
}

async function signInForm(ctx) {
  ctx.response.body = await render.signInForm();
}

async function signIn(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    try {
      const pairs = await body.value;
      const credentials = Object.fromEntries(pairs);
      const user = users.get(credentials.username);

      if (!user || user.password !== credentials.password) {
        ctx.throw(401, 'Invalid credentials');
      }
      ctx.cookies.set('user', credentials.username);
      ctx.response.redirect('/');
    } catch (error) {
      ctx.throw(500, 'Internal Server Error');
    }
  }
}

async function checkAuth(ctx, next) {
  const user = ctx.cookies.get('user');
  if (!user && ctx.request.url.pathname !== '/signin' && ctx.request.url.pathname !== '/signup') {
    ctx.response.redirect('/signin');
  } else {
    await next();
  }
}

const port = parseInt(Deno.args[0]) || 8001;
console.log(`Server run at http://127.0.0.1:${port}`);
await app.listen({ port });
