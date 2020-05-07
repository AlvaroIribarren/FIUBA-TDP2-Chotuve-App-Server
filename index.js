const express = require("express")
const morgan = require("morgan")
const baseRoute = require("./routes/base")
const saludoRoute = require("./routes/saludo")
const usersRoute = require("./routes/users")
const friendsRoute = require("./routes/friends")
const videosRoute = require("./routes/videos")
const requestsRoute = require("./routes/requests")
const commentsRoute = require("./routes/comments")
const reactionsRoute = require("./routes/reactions")
const messagesRoute = require("./routes/messages")
const tokensRoute = require("./routes/tokens")
const loginRoute = require("./routes/login")
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
server.use("/users", usersRoute);
server.use("/friends", friendsRoute);
server.use("/videos", videosRoute);
server.use("/requests", requestsRoute);
server.use("/comments", commentsRoute);
server.use("/reactions", reactionsRoute);
server.use("/messages", messagesRoute);
server.use("/tokens", tokensRoute);
server.use("/login", loginRoute);
server.use("*", unknownRoute);