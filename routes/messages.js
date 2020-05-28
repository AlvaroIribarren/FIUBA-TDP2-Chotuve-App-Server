const express = require('express')
const router = express.Router();
const MessageManager = require("../Managers/MessagesManager")
const auth = require("../Middleware/auth")

router.get("/", auth, async (req, res) =>{
    try {
        const users = await MessageManager.getAllMessages();
        console.log(users);
        res.send(users);
    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
})

router.post("/", auth, async (req, res) => {
    try{
        await MessageManager.postMessage(req.body, res);
    } catch (err) {
        console.error(err);
        res.send("ERROR:" + err);
    }
})

module.exports = router;