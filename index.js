const express = require("express")
const morgan = require("morgan")
const baseRoute = require("./routes/base")
const usersRoute = require("./routes/users")
const friendsRoute = require("./routes/friends")
const videosRoute = require("./routes/videos")
const requestsRoute = require("./routes/requests")
const commentsRoute = require("./routes/comments")
const reactionsRoute = require("./routes/reactions")
const messagesRoute = require("./routes/messages")
const tokensRoute = require("./routes/tokens")
const pingRoute = require("./routes/ping")
const loginRoute = require("./routes/login")
const statusRoute = require("./routes/status")
const unknownRoute = require("./routes/unknown")

const madge = require('madge');

madge('./index.js').then((res) => {
    console.log(res.circular());
});

const bodyParser = require("body-parser")
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

const port = process.env.PORT || 5000
server.listen(port, ()=>{
    console.log("Servidor escuchando en el puerto:", port);
});

server.set("views", __dirname + "/views");

const RequestTableManager = require("./Managers/RequestTableManager")
server.use(morgan(function (tokens, req, res) {
        const str =  [
            tokens.method(req, res),
            tokens.url(req, res), 'with status',
            tokens.status(req, res), 'with response length',
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ');
        RequestTableManager.insertRequest(req,res,tokens).then();
        return str;
    })
);


server.use("/", baseRoute);
server.use("/users", usersRoute);
server.use("/friends", friendsRoute);
server.use("/videos", videosRoute);
server.use("/requests", requestsRoute);
server.use("/comments", commentsRoute);
server.use("/reactions", reactionsRoute);
server.use("/messages", messagesRoute);
server.use("/tokens", tokensRoute);
server.use("/ping", pingRoute);
server.use("/login", loginRoute);
server.use("/status", statusRoute);
server.use("*", unknownRoute);





