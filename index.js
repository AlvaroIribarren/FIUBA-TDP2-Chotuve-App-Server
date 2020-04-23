const express = require("express")
const morgan = require("morgan")
const server = express();
const baseRoute = require("./routes/base")
const saludoRoute = require("./routes/saludo")
const loginRoute = require("./routes/login")
const unknownRoute = require("./routes/unknown")

server.set("views", __dirname + "/views");
server.use(morgan("short"));

server.use("/", baseRoute);
server.use("/saludo", saludoRoute);
server.use("/login", loginRoute);
server.use("*", unknownRoute);

const port = process.env.PORT || 5000
server.listen(port, ()=>{
    console.log("Servidor escuchando en el puerto:", port);
});

