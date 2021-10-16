const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", function (socket) {
    console.log("nuevo cliente");
    socket.on("message_evt", function (message) {
        //Gestionar los mensajes recibidos de los clientes
    });

});

server.listen(3000, () => console.log('server started'));