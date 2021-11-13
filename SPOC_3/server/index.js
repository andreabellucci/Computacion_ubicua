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
    user_list = [...user_list, new_user]

    console.log("NEW REGISTER --> ID: [" + new_user.id + "], USERNAME: [" + new_user.username + "]");

    io.emit("update_connected_users_list", user_list);
    console.log(user_list);
  });

  // Handle disconnect
  socket.on('disconnect', function () {
    console.log('User: [' + socket.id + "] has been disconnected");

    const isUser = (user) => user.id == socket.id;

    let rmUsrIndex = user_list.findIndex(isUser);
    user_list.splice(rmUsrIndex, 1);

    io.emit("update_connected_users_list", user_list);
    console.log(user_list);
  });

  // Public message broadcasting
  socket.on("broadcast_public_message", function (message) {
    console.log("GLOBAL FROM: [" + message.from + "]");
    console.log(message);
    io.emit("deliver_public_message", message);
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
      io.to(destinationSocket).emit("deliver_private_message", message);
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
