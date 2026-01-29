let userName = null;
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const socket = io();
socket.on('message', (event) => addMessage(event.author, event.content));
socket.on('newUser', (userName) =>
  addMessage(
    'Chat Bot',
    `<i> ${userName.login} has joined the conversation! </i>`
  )
);
socket.on('removeUser', (user) => {
  addMessage(
    'Chat Bot',
    `<i> ${user.login} has left the conversation... :( </i>`
  );
});

function login(e) {
  e.preventDefault();
  if (!userNameInput.value.trim()) {
    alert('User name field is empty');
  } else {
    userName = userNameInput.value;
    socket.emit('join', { login: userName });
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    addMessageForm.classList.add('show');
  }
}

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
}

function sendMessage(e) {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if (!messageContent.length) {
    alert('You have to type something!');
  } else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = '';
  }
}

loginForm.addEventListener('submit', (e) => {
  login(e);
});

addMessageForm.addEventListener('submit', (e) => {
  sendMessage(e);
});
