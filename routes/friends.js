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

//todo: cambiar para no recibir ambas aids
router.get("/:id1/:id2", async (req, res) => {
    console.log("You asked for a certain relation between users")
    const relation = await FriendsManager.getRelationByUsersIds(req.params.id1, req.params.id2);
    res.send(relation);
    console.log(relation);
})



router.post("/", async (req, res) => {
    await FriendsManager.validateInput(req.body);
    await FriendsManager.postRelation(req.body, res);
})

router.delete("/:id1/:id2", async (req,res) => {
    const id1 = parseInt(req.params.id1);
    const id2 = parseInt(req.params.id2);

    await FriendsManager.deleteRelation(id1, id2);
    await FriendsManager.deleteRelation(id2, id1);

    res.send("Relation deleted");
})

module.exports = router;
