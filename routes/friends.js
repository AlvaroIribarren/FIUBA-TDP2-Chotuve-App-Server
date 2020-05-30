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


//todo: actualizar con el post de users.
router.post("/", auth, async (req, res) => {
    const error = await FriendsManager.validateInput(req.body).error;
    if(!error)
        await FriendsManager.postRelation(req.body, res);
})


module.exports = router;
