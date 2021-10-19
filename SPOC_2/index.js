// constants
const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const fs = require('fs');

// present the users the correct web page
app.use(express.static('www'));

io.on("connection", function (socket) {
  console.log("[NEW CLIENT CONNECTED...] SOCKET.ID: " + socket.id);

  socket.on("add_task", function (message) {
    console.log("[UPDATING TASKS STORAGE...]\n");
    openFile(message);
  });
});

app.get("/tasks.json", function (req, res) {
  console.log("[REQUESTING ALL TASKS...]");

  const path = __dirname + "/tasks.json";

  fs.readFile(path, 'utf-8', (err, data) => {
    console.log("hola");
    if (err) {
      console.error(`[ERROR WHILE READING FILE] ${err.message}`);
    } else {
      let new_json = JSON.parse(data);
      let string_json = JSON.stringify(new_json);

      res.end(string_json);
    }
  })
});

async function openFile(content) {
  try {
    const path = __dirname + "/tasks.json";
    fs.writeFile(path, content, { flag: 'w+' });
  } catch (error) {
    console.error(`[ERROR WHILE WRITING FILE] ${error.message}`);
  }
}

server.listen(3000, () => console.log('server started'));