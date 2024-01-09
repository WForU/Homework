var R = {};

window.onhashchange = async function () {
  var r;
  var tokens = window.location.hash.split('/');
  console.log('tokens=', tokens);
  switch (tokens[0]) {
    case '#show':
      r = await window.fetch('/post/' + tokens[1]);
      let post = await r.json();
      R.show(post);
      break;
    case '#new':
      R.new();
      break;
    default:
      r = await window.fetch('/list');
      let posts = await r.json();
      R.list(posts);
      break;
  }
};

window.onload = function () {
  window.onhashchange();
};

R.layout = function (title, content) {
  document.querySelector('title').innerText = title;
  document.querySelector('#content').innerHTML = content;
};

R.list = function (posts) {
  let list = posts.map(post => `
    <li>
      <h2>${post.title}</h2>
      <p><a id="show${post.id}" href="#show/${post.id}">View Phone Num</a></p>
    </li>
  `);

  let content = `
    <h1>Contact</h1>
    <p>You Have <strong>${posts.length}</strong> Contacts</p>
    <p><a id="createPost" href="#new">Add Contact</a></p>
    <ul id="posts">
      ${list.join('\n')}
    </ul>
  `;

  R.layout('Posts', content);
};

R.new = function () {
  R.layout('New Post', `
    <h1>Test</h1>
    <p>Add Contact</p>
    <form>
      <p><input id="name" type="text" placeholder="name" name="name"></p>
      <p><input id="tel" type="text" placeholder="tel" name="tel"></p>
      <p><input id="savePost" type="button" value="Create"></p>
    </form>
  `);

  document.getElementById('savePost').addEventListener('click', R.savePost);
};

R.show = function (post) {
  R.layout(post.title, `
    <h1>${post.title}</h1>
    <p>${post.body}</p>
  `);
};

R.savePost = async function () {
  let name = document.querySelector('#name').value;
  let tel = document.querySelector('#tel').value;
  let r = await window.fetch('/post', {
    body: DULA.stringify({ title: name, body: tel }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  window.location.hash = '#list';
  return r;
};
