var R = {};

var socket = new WebSocket("ws://" + window.location.hostname + ":8080");

socket.onopen = function (event) {
  console.log('Socket connection opened...');
};

function send(o) {
  if (socket.readyState === 1) {
    socket.send(JSON.stringify(o));
  } else {
    setTimeout(function () {
      send(o);
    }, 1000);
  }
}

window.onhashchange = function () {
  var tokens = window.location.hash.split('/');
  console.log('Tokens:', tokens);
  switch (tokens[0]) {
    case '#show':
      send({ type: 'show', post: { id: parseInt(tokens[1]) } });
      break;
    case '#new':
      R.new();
      break;
    default:
      send({ type: 'list' });
      break;
  }
};

socket.onmessage = function (event) {
  var msg = JSON.parse(event.data);
  console.log('Received message:', msg);
  switch (msg.type) {
    case 'show':
      R.show(msg.post);
      break;
    case 'list':
      R.list(msg.posts);
      break;
  }
};

window.onload = function () {
  console.log('Onload');
  window.location.href = "#list";
  window.onhashchange();
};

R.layout = function (title, content) {
  document.querySelector('title').innerText = title;
  document.querySelector('#content').innerHTML = content;
};

R.list = function (posts) {
  var list = posts.map(function (post) {
    return `
    <li>
      <h2>${post.title}</h2>
      <p><a id="show${post.id}" href="#show/${post.id}">View Contacts</a></p>
    </li>`;
  });

  var content = `
    <h1>通訊錄</h1>
    <p>You have <strong>${posts.length}</strong> contact${posts.length !== 1 ? 's' : ''}</p>
    <p><a id="createPost" href="#new">Create New Contact</a></p>
    <ul id="posts">${list.join('\n')}</ul>`;

  return R.layout('Posts', content);
};

R.new = function () {
  return R.layout('New Post', `
    <h1>Contact Person</h1>
    <p>Create New Contact</p>
    <form>
      <p><input id="name" type="text" placeholder="Name" name="name"></p>
      <p><input id="tel" placeholder="Tel" name="tel"></p>
      <p><input id="savePost" type="button" onclick="R.savePost()" value="Create"></p>
    </form>
  `);
};

R.show = function (post) {
  return R.layout(post.title, `
    <h1>${post.title}</h1>
    <p>${post.body}</p>
  `);
};

R.savePost = function () {
  var title = document.querySelector('#name').value;
  var body = document.querySelector('#tel').value;
  send({ type: 'create', post: { title: title, body: body } });
  window.location.hash = '#list';
};
