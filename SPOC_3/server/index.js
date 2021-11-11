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

    var rmUsrIndex = user_list.findIndex(this.id == socket.id);
    allClients.splice(rmUsrIndex, 1);
  });

  // Public message broadcasting
  socket.on("send_public_message", function (message) {
    let sourceUser = message.from;
    console.log("GLOBAL FROM: [" + sourceUser + "]");
    console.log(message);
    socket.broadcast.emit("broadcast_public_message", message);
  });

  // Private message sending
  socket.on("send_private_message", function (message) {
    let sourceUser = message.from;
    let destinationUser = message.to;

    let destinationSocket = user_list.find(usr => {
      return usr.username == sourceUser;
    });

    if (destinationSocket != null) {
      console.log("SENDING FROM: [" + sourceUser + "] TO [" + destinationUser + "]");
      io.to(destinationSocket).emit("send_private_message", message);
    } else {
      console.log("CANNOT SEND FROM: [" + sourceUser + "] TO [" + destinationUser + "]");
    }
  });

  // Function that gives the connected user list
  socket.on("get_connected_list", function () {
    console.log("REQUESTING USER LIST TO: [" + socket.id + "]");
    io.to(socket.id).emit("get_connected_list", user_list);
  });

  // Give the client his username
  io.to(socket.id).emit("new_username", new_user.username);
});

server.listen(3001, () => console.log('server started'));
