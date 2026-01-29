const express = require('express');
const path = require('path');
const socket = require('socket.io');

const messages = [];
const users = [];
const app = express();

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000);
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => {
    console.log("Oh, I've got something from " + socket.id);
    socket.broadcast.emit('message', message);
    messages.push(message);
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((u) => u.loginId === socket.id);
    if (index !== -1) {
      const removedUser = users[index];
      users.splice(index, 1);
      socket.broadcast.emit('removeUser', removedUser);
    }
  });
  console.log("I've added a listener on message and disconnect events \n");

  socket.on('join', (user) => {
    user.loginId = socket.id;
    users.push(user);
    socket.broadcast.emit('newUser', user);
  });
});

app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});
