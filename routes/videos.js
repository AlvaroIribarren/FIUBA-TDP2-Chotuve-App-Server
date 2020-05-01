const express = require('express');
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const VideosManager = require("../databases/VideosManager")
const CommentManager = require("../databases/CommentsManager")
const OpinionManager = require("../databases/OpinionsManager")

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

router.get("/:video_id/opinions", async(req, res) => {
    const video_id = parseInt(req.params.video_id);
    const opinions = await OpinionManager.getAllOpinionsFromVideo(video_id);
    res.send(opinions);
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
            const url = req.body.url;
            let localPublic =  await VideosManager.turnBooleanIntoBit(req.body.public);

            const id = await VideosManager.insertVideo(author_id, author_name, title,
                                                        description, location, localPublic, url);

            localPublic = await VideosManager.turnBitIntoBoolean(localPublic);
            res.send({id, author_id, author_name, title, description, public: localPublic, url, location});
        } else {
            res.status(404).send("Author's id or name was not found");
        }
    } else {
        res.status(400).send(error.details[0].message);
    }
})


module.exports = router;
