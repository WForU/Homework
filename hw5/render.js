export function layout(name, content) {
  return `
  <html>
  <head>
    <title>${name}</title>
    <link rel="stylesheet" href="/public/main.css">
  </head>
  <body>
    <section id="content">
      ${content}
    </section>
  </body>
  </html>
  `
}

export function list(posts) {
  let list = []
  for (let post of posts) {
    list.push(`
    <li>
      <h2>${ post.name }</h2>
      <p><a href="/post/${post.id}">View Phone Number</a></p>
    </li>
    `)
  }
  let content = `
  <h1>Contact</h1>
  <p>You Have <strong>${posts.length}</strong> Contacts!</p>
  <p><a href="/post/new">Add New Contact</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  `
  return layout('Posts', content)
}

export function newPost() {
  return layout('New Post', `
  <h1>List</h1>
  <p>Add New Contact</p>
  <form action="/post" method="post">
    <p><input type="text" placeholder="name" name="name"></p>
    <p><input type="text" placeholder="tel" name="tel""></p>
    <p><input type="submit" value="Create"></p>
  </form>
  `)
}

export function show(post) {
  return layout(post.name, `
    <h1>${post.name}</h1>
    <p>Phone Number:${post.tel}</p>
  `)
}
