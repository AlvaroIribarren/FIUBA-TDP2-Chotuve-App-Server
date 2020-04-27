const express = require('express')
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const FriendsManager = require("../databases/FriendsManager")
const Joi = require("joi")

router.get("/", async (req, res) => {
    const relations = await FriendsManager.getRelations();
    res.send(relations);
})

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const relation = await FriendsManager.getRelationById(id);
    res.send(relation);
})

router.get("/:id1/:id2", async (req, res) => {
    console.log("You asked for a certain relation between users")
    const relation = await FriendsManager.getRelationByUsersIds(req.params.id1, req.params.id2);
    res.send(relation);
    console.log(relation);
})

async function validateInput(body){
    const schema = {
        id1: Joi.number().positive().required(),
        id2: Joi.number().positive().required()
    }

    return Joi.validate(body, schema);
}

router.post("/", async (req, res) => {
    await validateInput(req.body);
    const id1 = parseInt(req.body.id1);
    const id2 = parseInt(req.body.id2);

    const user1 = await UserManager.getUserById(id1);
    const user2 = await UserManager.getUserById(id2);

    if (user1 && user2){
        await FriendsManager.insertRelation(id1, id2);
        await FriendsManager.insertRelation(id2, id1);
        res.send("Amistad agregada entre: " + id1 + id2);
    } else {
        res.status(404).send("ID inexistente");
    }
})

router.delete("/:id1/:id2", async (req,res) => {
    const id1 = parseInt(req.params.id1);
    const id2 = parseInt(req.params.id2);

    await FriendsManager.deleteRelation(id1, id2);
    await FriendsManager.deleteRelation(id2, id1);

    res.send("Relation deleted");
})

module.exports = router;
