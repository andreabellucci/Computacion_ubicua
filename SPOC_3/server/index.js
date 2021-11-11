const express = require('express');
const { SocketAddress } = require('net');
const app = express();
const server = require("http").Server(app);
var generator = require('project-name-generator');

let user_list = [];

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", function (socket) {

  // Make a new user for each one connected
  let new_user = { id: socket.id, username: generator({ words: 1, number: true }).dashed }
  user_list.push();

  console.log("NEW CLIENT --> ID: [" + new_user.id + "], USERNAME: [" + new_user.username + "]");

  // Handle disconnect
  socket.on('disconnect', function () {
    console.log('User: [' + socket.id + "] has been disconnected");

    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
  });

  // Public message broadcasting
  socket.on("send_public_message", function (message) {
    console.log(socket.id, message);
    socket.broadcast.emit("broadcast_public_message", message);
  });

  // Private message sending
  socket.on("send_private_message", function (message) {
    console.log(socket.id, message);
    socket.emit("receive_private_message", message);
  });

  // Function that gives the connected user list
  socket.on("get_connected_list", function () {
    console.log("REQUESTING USER LIST TO: [" + socket.id + "]");
    io.socket(socket.id).emit(user_list);
  });

});

server.listen(3001, () => console.log('server started'));
