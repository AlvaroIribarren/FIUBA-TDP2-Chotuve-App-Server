const express = require('express');
const router = express.Router();
const LoginManager = require("../Managers/LoginManager")
const Joi = require("joi")

router.get("/", async (req, res) => {
    res.send("Login");
})

async function validateInput(body){
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
    return Joi.validate(body, schema);
}

//
router.post("/", async (req, res) => {
    const firebase_token = req.body.firebase_token;
    const data = await LoginManager.login(firebase_token);
    res.send(data);
})

module.exports = router;
