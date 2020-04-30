const express = require('express')
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const FriendManager = require("../databases/FriendsManager")
const Joi = require("joi")

const minNameLength = 3;
const minPassLength = 5;

/*
    id: lo mando yo
    email: string
    name: string
    password: string
    phone: string
    profileimgurl: string
*/


router.get("/", async (req, res) =>{
    try {
        const users = await UserManager.getUsers();
        console.log(users);
        res.send(users);
    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
})


router.get("/:id", async (req, res) =>{
    const id = parseInt(req.params.id);
    await checkIdsExistence(req,res);
    const user = await UserManager.getUserById(id);
    res.send(user);
})

router.get("/:id/friends", async (req, res) => {
    const userId = parseInt(req.params.id);
    const friends = await FriendManager.getAllRelationsFromUser(userId);
    res.send(friends);
})


function validateUser(body){
    const schema = {
        name: Joi.string().min(minNameLength).required(),
        password: Joi.string().min(minPassLength).required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        profileimgurl: Joi.string().required(),
    }
    return Joi.validate(body, schema);
}


router.post('/', async (req, res) => {
    const error = validateUser(req.body).error;
    if (!error){
        const id = await UserManager.generateNewId();
        const name = req.body.name;
        const password = req.body.password;
        const email = req.body.email;
        const phone = req.body.phone;
        const profileImgUrl = req.body.profileimgurl;
        await UserManager.insertUser(id, name, password, email, phone, profileImgUrl);
        res.status(201).send({id, name, password, email, phone, profileImgUrl});
    } else {
        res.status(400).send(error.details[0].message);
    }
})

async function checkIdsExistence(req, res){
    const id = parseInt(req.params.id);
    const user = await UserManager.getUserById(id);
    console.log(user);

    if (!user){
        res.status(404).send("No hay ningun usuario con id: " + id);
    }
}

router.put('/:id', async (req, res) => {
    await checkIdsExistence(req, res);
    const error = validateUser(req.body).error;

    console.log(req.body);
    if(error){
        res.status(400).send("Error en validacion: " + error.details[0].message);
    } else {
        const newUserName = req.body.name;
        await UserManager.editUser('name', newUserName, 'id', id);
        res.send(newUserName);
    }
})

router.delete('/:id', async (req, res) => {
    await checkIdsExistence(req, res);
    const id = parseInt(req.params.id);
    await UserManager.deleteUserById(id);
    res.status(200).send("User eliminated");
})

module.exports = router;
