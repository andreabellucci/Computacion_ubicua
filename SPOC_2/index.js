const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// Settings
app.use(express.static('www'));

io.on("connection", function (socket) {
  console.log("nuevo cliente: " + socket.id);

  socket.on("fetch_tasks", function (message) {
    console.log("Recuperando tareas...");

    fetch('tasks.json')
      .then(response => response.text())
      .then(textString => {

        console.log(textString);

      });
  });

  socket.on("add_tasks", function (message) {
    console.log("Añadiendo tareas...");
  });

});

server.listen(3000, () => console.log('server started'));