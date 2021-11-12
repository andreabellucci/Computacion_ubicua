const express = require('express');
const { SocketAddress } = require('net');
const app = express();
const server = require("http").Server(app);

let user_list = [];

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", function (socket) {

  socket.on('register_user', function (username) {
    // Make a new user for each one connected
    let new_user = { id: socket.id, username: username }
    user_list.push();

    console.log("NEW REGISTER --> ID: [" + new_user.id + "], USERNAME: [" + new_user.username + "]");
  });

  // Handle disconnect
  socket.on('disconnect', function () {
    console.log('User: [' + socket.id + "] has been disconnected");

    // var rmUsrIndex = user_list.findIndex(this.id == socket.id);
    // allClients.splice(rmUsrIndex, 1);
  });

  // Public message broadcasting
  socket.on("broadcast_public_message", function (message) {
    console.log("GLOBAL FROM: [" + message.from + "]");
    console.log(message);
    io.emit("send_public_message", message);
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
});

server.listen(3001, () => console.log('server started'));
