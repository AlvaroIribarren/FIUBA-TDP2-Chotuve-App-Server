const express = require('express')
const router = express.Router();
const ReactionManager = require("../Managers/Reactions/ReactionsManager")
const postReaction = require("../Managers/Reactions/ReactionsIndex")
const VideoManager = require("../Managers/Videos/VideosManager")
const auth = require("../Middleware/auth")

async function validateVideosExistance(video_id){
    return await VideoManager.getVideoById(video_id);
}

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
    const videoExists = validateVideosExistance(parseInt(req.body.video_id));
    if (videoExists)
        await postReaction(req.body, res);
})

module.exports = router;
