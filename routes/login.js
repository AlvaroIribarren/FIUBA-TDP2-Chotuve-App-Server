const express = require('express');
const router = express.Router();
const LoginManager = require("../Managers/LoginManager")
const UserManager = require("../Managers/Users/UsersManager")

const server_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ4NTM0MzIsIm5iZiI6MTU5NDg1MzQz" +
    "MiwianRpIjoiZWMwYWIxZWMtNmIxNS00NGNjLWE0ZTItNWI4ZWE1OTZjOTZkIiwiaWRlbnRpdHkiOiJodHRwczovL2Nob" +
    "3R1dmUtYXBwbGljYXRpb24tc2VydmVyLmhlcm9rdWFwcC5jb20vIiwidHlwZSI6InJlZnJl" +
    "c2giLCJ1c2VyX2NsYWltcyI6eyJzZXJ2ZXIiOnRydWV9fQ.klLra18fVSmrwKhENMGiLskZ5z2a8pRLEymBDZmVwnw";


router.post("/", async (req, res) => {
    console.log("token:" + req.body.firebase_token);
    try {
        if (req.body.email === "admin" && req.body.password === "admin"){
            res.status(200).send("Todo bien");
        } else {
            const email = req.body.email;
            const user = await UserManager.getUserByEmail(email);
            if (!user){
                //No se encontro el user, creo uno nuevo desde login.
                await UserManager.postUser(req.body, res);
            } else {
                const firebase_token = req.body.firebase_token;
                console.log("FB TOKEN ACA AAAAAAAAAAAAAAAA: " + firebase_token);
                const headers = {
                    "App-Server-Api-Key": server_token,
                    "Firebase-Token": firebase_token
                }

                const tokens_and_id = await LoginManager.getTokensFromCreatedUser(headers);
                await UserManager.updateLastLogin(id);          //actualiza la nueva fecha de login
                tokens_and_id.id = user.id;
                res.send(tokens_and_id);
            }
        }
    } catch {
        res.status(401).send("Invalid request from created user, probably no fb token");
    }
})

module.exports = router;
