const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// Settings
app.use(express.static('www'));

io.on("connection", function(socket){
  console.log("nuevo cliente: " + socket.id);

  socket.on("message_evt", function(message){
    console.log(socket.id, JSON.parse(message));
    socket.broadcast.emit("message_evt", message);
  });
  
});

server.listen(3000, () => console.log('server started'));