const express = require('express');
const router = express.Router();
const LoginManager = require("../Managers/LoginManager")


router.post("/", async (req, res) => {
    try {
        const firebase_token = req.body.firebase_token;
        const data = await LoginManager.getTokensFromCreatedUser(firebase_token);
        res.send(data);
    } catch {
        res.status(401).send("Invalid request from created user, probably no fb token");
    }
})

module.exports = router;
