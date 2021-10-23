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

  socket.on("mod_task", function (message) {
    console.log("[UPDATING TASKS STORAGE...]");
    
    const path = __dirname + "/tasks.json";

    fs.writeFile(path, message, { flag: 'w+' }, err => {
      if (err) {
        console.error(`[ERROR WHILE WRITING FILE] ${err.message}`);
        return
      }
    })
  });
});

app.get("/tasks.json", function (req, res) {
  console.log("[REQUESTING ALL TASKS...]");

  const path = __dirname + "/tasks.json";

  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      console.error(`[ERROR WHILE READING FILE] ${err.message}`);
    } else {
      let new_json = JSON.parse(data);
      let string_json = JSON.stringify(new_json);

      res.end(string_json);
    }
  })
});

server.listen(3000, () => console.log('server started'));
