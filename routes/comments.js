const express = require('express')
const router = express.Router();
const CommentManager = require("../databases/CommentsManager")

router.get("/", async (req, res) => {
    const relations = await CommentManager.getAllComments();
    res.send(relations);
})

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const relation = await CommentManager.getCommentByItsId(id);
    res.send(relation);
})

router.post("/", async (req, res) => {
    const error = await CommentManager.validateInput(req.body).error;
    if (!error) {
        const author_id = req.body.author_id;
        const author_name = req.body.author_name;
        const video_id = req.body.video_id;
        const comment = req.body.comment;
        const data = {author_id, author_name, video_id, comment};
        await CommentManager.postComment(data, res);
    } else {
        res.status(400).send(error.details[0].message);
    }
})

module.exports = router;