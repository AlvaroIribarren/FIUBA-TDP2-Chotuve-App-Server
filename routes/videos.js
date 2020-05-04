const express = require('express');
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const VideosManager = require("../databases/VideosManager")
const CommentManager = require("../databases/CommentsManager")
const ReactionManager = require("../databases/ReactionsManager")
const MediaManager = require("../databases/AxiosManager")
const URLSManager = require("../databases/URLSManager")

const Joi = require("joi")

//todo: agregar pedir videos a media
router.get("/", async (req, res) => {
    const videos = await VideosManager.getVideos();
    console.log("Imprimiendo videos");
    console.log(videos);
    res.send(videos);
})

router.get("/appServer", async (req,res)=>{
    const videosInAppSv = await VideosManager.getVideosInAppServer();
    res.send(videosInAppSv);
})

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const video = await VideosManager.getVideoById(id);
    res.send(video);
})

router.get("/:video_id/comments", async (req, res) => {
    const video_id = parseInt(req.params.video_id);
    const comments = await CommentManager.getAllCommentsFromVideo(video_id);
    res.send(comments);
})

router.get("/:video_id/opinions", async(req, res) => {
    const video_id = parseInt(req.params.video_id);
    const reactions = await ReactionManager.getAllReactionsFromVideo(video_id);
    res.send(reactions);
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
            //Cambio nombre para no tener problemas con la palabra reservada public.
            const localPublic =  req.body.public;
            //const id = await VideosManager.createVideoInMedia({url});
            const id = await URLSManager.insertUrl(url);
            console.log(res);
            console.log("Id recibida de media: " + id);

            await VideosManager.insertVideo(id, author_id, author_name, title,
                                                        description, location, localPublic);

            res.send({id, author_id, author_name, title, description, public: localPublic, url, location});
        } else {
            res.status(404).send("Author's id or name was not found");
        }
    } else {
        res.status(400).send(error.details[0].message);
    }
})

router.post("/:video_id/reactions", async (req, res) => {
    const error = await ReactionManager.validateInput(req.body).error;

    if (!error) {
        const author_id = req.body.author_id;
        const author_name = req.body.author_name;
        const video_id = parseInt(req.params.video_id);
        const positive_reaction = req.body.positive_reaction;
        const data = {author_id, author_name, video_id, positive_reaction};
        await ReactionManager.postReaction(data, res);
    } else {
        res.status(400).send(error.details[0].message);
    }
})

router.post("/:video_id/comments", async (req, res) => {
    const error = await CommentManager.validateInput(req.body).error;
    if (!error) {
        const author_id = req.body.author_id;
        const author_name = req.body.author_name;
        const video_id = parseInt(req.params.video_id);
        const comment = req.body.comment;
        const data = {author_id, author_name, video_id, comment};
        await CommentManager.postComment(data, res);
    } else {
        res.status(400).send(error.details[0].message);
    }
})




module.exports = router;
