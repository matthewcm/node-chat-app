const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
  
const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log("New User connected");

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined the chat room.'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage: ', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback("This is from the server");
  });

  socket.on("disconnect", () =>{
    console.log('User was disconnected');
  })
});
server.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});


