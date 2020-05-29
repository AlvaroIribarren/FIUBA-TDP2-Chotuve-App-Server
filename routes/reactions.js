const express = require('express')
const router = express.Router();
const ReactionManager = require("../Managers/Exportables/ReactionManagerBuilder")
const auth = require("../Middleware/auth")

router.get("/", auth, async (req, res) => {
    const relations = await ReactionManager.getAllReactions();
    res.send(relations);
})

router.get("/:id", auth, async (req, res) => {
    const id = parseInt(req.params.id);
    const relation = await ReactionManager.getReactionById(id);
    res.send(relation);
})

router.post("/", auth, async (req, res) => {
    await ReactionManager.validateInput(req.body);
    await ReactionManager.postReaction(req.body, res);
})

module.exports = router;
