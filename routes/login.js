const express = require('express');
const router = express.Router();
const LoginManager = require("../Managers/LoginManager")

router.post("/relogin", async (req, res) => {
    try {
        const refresh_token = req.headers.refresh_token;
        const sl_token = await LoginManager.getNewSLToken(refresh_token);
        res.send(sl_token);
    } catch {
        res.status(401).send("Invalid request in relogin, probably refresh token missing");
    }
})


router.post("/created_user", async (req, res) => {
    try {
        const firebase_token = req.body.firebase_token;
        const data = await LoginManager.getTokensFromCreatedUser(firebase_token);
        res.send(data);
    } catch {
        res.status(401).send("Invalid request from created user, probably no fb token");
    }
})

module.exports = router;
