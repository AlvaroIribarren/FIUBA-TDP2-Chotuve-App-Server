const express = require('express')
const router = express.Router();
const FriendsManager = require("../Managers/FriendsManager")
const auth = require("../Middleware/auth")

router.get("/", auth, async (req, res) => {
    const relations = await FriendsManager.getRelations();
    res.send(relations);
})

router.get("/:id", auth, async (req, res) => {
    const id = parseInt(req.params.id);
    const relation = await FriendsManager.getRelationById(id);
    res.send(relation);
})

router.get("/:id1/:id2", auth, async (req, res) => {
    console.log("You asked for a certain relation between users")
    const relation = await FriendsManager.getRelationByUsersIds(req.params.id1, req.params.id2);
    res.send(relation);
    console.log(relation);
})

//todo: actualizar con el post de users.
router.post("/", auth, async (req, res) => {
    const error = await FriendsManager.validateInput(req.body).error;
    if(!error)
        await FriendsManager.postRelation(req.body, res);
})

router.delete("/:id1/:id2", auth, async (req,res) => {
    const id1 = parseInt(req.params.id1);
    const id2 = parseInt(req.params.id2);

    await FriendsManager.deleteRelationByUsersIds(id1, id2);
    await FriendsManager.deleteRelationByUsersIds(id2, id1);

    res.send("Relation deleted");
})

module.exports = router;
