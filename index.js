const express = require("express")
const morgan = require("morgan")
const baseRoute = require("./routes/base")
const saludoRoute = require("./routes/saludo")
const loginRoute = require("./routes/login")
const dataBaseRoute = require("./routes/database")
const unknownRoute = require("./routes/unknown")
const bodyParser = require("body-parser")
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

const port = process.env.PORT || 5000
server.listen(port, ()=>{
    console.log("Servidor escuchando en el puerto:", port);
});

server.set("views", __dirname + "/views");
server.use(morgan("short"));

server.use("/", baseRoute);
server.use("/saludo", saludoRoute);
server.use("/login", loginRoute);
server.use("/db", dataBaseRoute);
server.use("*", unknownRoute);



