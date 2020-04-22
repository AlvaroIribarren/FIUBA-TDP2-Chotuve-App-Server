const express = require("express")
const morgan = require("morgan")
const server = express();


server.set("views", __dirname + "/views");

server.use(morgan("short"));

var port = 8888;
server.listen(port, ()=>{
    console.log("Servidor escuchando en el puerto:", port);
});
