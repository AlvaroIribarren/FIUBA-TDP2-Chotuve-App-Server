const express = require('express')
const router = express.Router();
const CommentManager = require("../Managers/CommentsManager")
const VideoManager = require("../Managers/Videos/VideosManager")
const auth = require("../Middleware/auth")

async function validateVideoInfo(video_id) {
    return await VideoManager.getVideoById(video_id);
}

router.get("/", auth, async (req, res) => {
    const comments = await CommentManager.getAllComments();
    res.send(comments);
})

router.get("/:id", auth, async (req, res) => {
    const id = parseInt(req.params.id);
    const relation = await CommentManager.getCommentByItsId(id);
    res.send(relation);
})

router.post("/", auth, async (req, res) => {
    const error = await CommentManager.validateInput(req.body).error;
    if (!error) {
        const video_id = req.body.video_id;
        const rightVideoInfo = await validateVideoInfo(video_id);
        if (rightVideoInfo){
            const author_id = req.body.author_id;
            const comment = req.body.comment;
            const data = {author_id, video_id, comment};
            await CommentManager.postComment(data, res);
        }
    } else {
        res.status(400).send(error.details[0].message);
    }
})

module.exports = router;
