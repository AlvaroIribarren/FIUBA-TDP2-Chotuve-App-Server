const express = require('express')
const router = express.Router();
const ReactionManager = require("../Managers/ReactionsManager")

router.get("/", async (req, res) => {
    const relations = await ReactionManager.getAllReactions();
    res.send(relations);
})

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const relation = await ReactionManager.getReactionById(id);
    res.send(relation);
})

router.post("/", async (req, res) => {
    await ReactionManager.validateInput(req.body);
    await ReactionManager.postReaction(req.body, res);
})

module.exports = router;
