const express = require('express')
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const FriendsManager = require("../databases/FriendsManager")
const VideosManager = require("../databases/VideosManager")
const CommentManager = require("../databases/CommentsManager")
const Manager = require("../databases/DBManager")
const Joi = require("joi")

//todo: agregar pedir videos a media
router.get("/", async (req, res) => {
    const relations = await VideosManager.getVideos();
    res.send(relations);
})

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const relation = await VideosManager.getVideoById(id);
    res.send(relation);
})

router.get("/:video_id/comments", async (req, res) => {
    const video_id = parseInt(req.params.video_id);
    const comments = await CommentManager.getAllCommentsFromVideo(video_id);
    res.send(comments);
})

async function validateInput(body){
    const schema = {
        author_id: Joi.number().positive().required(),
        author_name: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string(),
        location: Joi.string(),
        public: Joi.required(),
        url: Joi.string().required()
    }
    return Joi.validate(body, schema);
}

async function validateUserInfo(author_id, author_name){
    return await UserManager.checkCorrectIdAndName(author_id, author_name);
}

router.post("/", async (req, res) => {
    const error = await validateInput(req.body).error;
    if (!error){
        const author_id = parseInt(req.body.author_id);
        const author_name = req.body.author_name;
        const rightUserInfo = await validateUserInfo(author_id, author_name);
        if (rightUserInfo){
            const title = req.body.title;
            const description = req.body.description;
            const location = req.body.location;
            let public = req.body.public;

            public = await Manager.turnBooleanToBit(public);
            const url = req.body.url;

            const id = await VideosManager.insertVideo(author_id, author_name, title,
                                                        description, location, public, url);

            public = await Manager.turnBitToBoolean(public);
            res.send({id, author_id, author_name, title, description, public, url, location});
        } else {
            res.status(404).send("Author's id or name was not found");
        }
    } else {
        res.status(400).send(error.details[0].message);
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
