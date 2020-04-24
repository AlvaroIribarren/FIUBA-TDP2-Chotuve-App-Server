const express = require("express")
const morgan = require("morgan")
const baseRoute = require("./routes/base")
const saludoRoute = require("./routes/saludo")
const loginRoute = require("./routes/login")
const unknownRoute = require("./routes/unknown")
const bodyParser = require("body-parser")
const server = express();

// //----------------------------
// var pg = require('pg');
//
// var connectionString = "postgres://xovbegcheqegut:13cd6d27773e4f49fbbc6fb4677a84d3b92f9c0093793238f468eab55e32186e@ec2-52-6-143-153.compute-1.amazonaws.com:5432/d6o8g7k6fm0qv1"
//
// pg.connect(connectionString, function(err, client, done) {
//     client.query('SELECT * FROM your_table', function(err, result) {
//         done();
//         if(err) return console.error(err);
//         console.log(result.rows);
//     });
// });
// //----------------------------
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
server.use("*", unknownRoute);





