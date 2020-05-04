const express = require('express')
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const MessageManager = require("../databases/MessagesManager")

router.get("/", async (req, res) =>{
    try {
        const users = await MessageManager.getAllMessages();
        console.log(users);
        res.send(users);
    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
})

router.post("/", async (req, res) => {
    try{
        await MessageManager.postMessage(req.body, res);
    } catch (err) {
        console.error(err);
        res.send("ERROR:" + err);
    }
})

module.exports = router;