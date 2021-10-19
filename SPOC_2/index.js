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

    // fetch('www/tasks.json')
    //   .then(response => response.text())
    //   .then(textString => {

    //     console.log(textString);

    //   });

    socket.emit("retrieve_tasks", );
  });

  socket.on("add_task", function (message) {
    console.log("[UPDATING TASKS STORAGE...]");
  });

});

server.listen(3000, () => console.log('server started'));