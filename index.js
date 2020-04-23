const express = require("express")
const morgan = require("morgan")
const baseRoute = require("./routes/base")
const saludoRoute = require("./routes/saludo")
const loginRoute = require("./routes/login")
const unknownRoute = require("./routes/unknown")
const bodyParser = require("body-parser")
const server = express();

const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        console.log(JSON.stringify(row));
    }
    client.end();
});


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





