const express = require('express');
const router = express.Router();
const LoginManager = require("../Managers/LoginManager")
const UserManager = require("../Managers/Users/UsersManager")


router.post("/", async (req, res) => {
    try {
        if (req.body.email === "admin" && req.body.password === "admin"){
            res.status(200).send("Todo bien");
        } else {
            const email = req.body.email;
            const user = await UserManager.getUserByEmail(email);
            if (!user){
                console.log("Creando nuevo user desde login");
                await UserManager.postUser(req.body, res);
            } else {
                const firebase_token = req.body.firebase_token;
                const id = user.id;
                const data = await LoginManager.getTokensFromCreatedUser(firebase_token, id);
                await UserManager.updateLastLogin(id);
                res.send(data);
            }
        }
    } catch {
        res.status(401).send("Invalid request from created user, probably no fb token");
    }
})

module.exports = router;
