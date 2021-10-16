const http = require("http");
const PORT = 3000;

const server = http.createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write("<h1>Hola, Servidor HTTP!</h1>");
    response.end();
});

server.listen(PORT);
console.log(`Listening! (port ${PORT})`);