const express = require('express');
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const Joi = require("joi")

const minNameLength = 5;
const minPassLength = 3;

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

router.post("/", async (req, res) => {
    const error = await validateInput(req.body).error;
    const email = req.body.email;
    const password = req.body.password;
    if (!error){
        const user = await UserManager.getUserByEmail(email);
        if (user){
            if (password === user.password){
                res.send(user);
            } else {
                res.status(400).send("Usuario encontrado pero contraseña incorrecta");
            }
        } else {
            res.status(404).send("User not found");
        }
    } else {
        res.status(400).send("Che virgo, tan mal las cosas, salu2");
    }
})

module.exports = router;
