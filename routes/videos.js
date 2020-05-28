const express = require('express');
const router = express.Router();
const UserManager = require("../Managers/Users/UsersManager")
const VideosManager = require("../Managers/Videos/VideosManager")
const CommentManager = require("../Managers/CommentsManager")
const ReactionManager = require("../Managers/ReactionsManager")
const auth = require("../Middleware/auth")

const Joi = require("joi")

async function noSearchQuery(search){
    return search === undefined || search === null || search === "" || search === " ";
}

router.get("/", auth, async(req, res) => {
    let search = req.query.search_query;
    const videos = await VideosManager.getVideos();
    if (await noSearchQuery(search)){
        res.send(videos);
    } else {
        const filtratedVideos = await VideosManager.getSearchRelatedVideos(videos, search);
        res.send(filtratedVideos);
    }
})

router.get("/appServer", auth, async (req,res)=>{
    const videosInAppSv = await VideosManager.getVideosInAppServer();
    res.send(videosInAppSv);
})

router.get("/:id", auth, async (req, res) => {
    const id = parseInt(req.params.id);
    const video = await VideosManager.getVideoById(id);
    res.send(video);
})

router.get("/:video_id/comments", auth, async (req, res) => {
    const video_id = parseInt(req.params.video_id);
    const comments = await CommentManager.getAllCommentsFromVideo(video_id);
    res.send(comments);
})

router.get("/:video_id/reactions", auth, async(req, res) => {
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
        url: Joi.string().required(),
        uuid: Joi.required()
    }
    return Joi.validate(body, schema);
}

async function validateUserInfo(author_id, author_name){
    return await UserManager.checkCorrectIdAndName(author_id, author_name);
}

router.post("/", auth, async (req, res) => {
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
            const uuid = req.body.uuid;

            const resultFromMedia = await VideosManager.createVideoInMedia({url, uuid});
            const id = resultFromMedia.id;
            console.log(res);
            console.log("Id recibida de media: " + id);

            await VideosManager.insertVideo(id, author_id, author_name, title, description, location, localPublic, uuid);

            res.send({id, author_id, author_name, title, description, public: localPublic, url, location, uuid});
        } else {
            res.status(404).send("Author's id or name was not found");
        }
    } else {
        res.status(400).send(error.details[0].message);
    }
})

router.post("/:video_id/reactions", auth, async (req, res) => {
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

router.post("/:video_id/comments", auth, async (req, res) => {
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

router.delete("/:video_id", auth, async (req,res) => {
    const video_id = parseInt(req.params.video_id);
    const videoExists = await VideosManager.getVideoById(video_id);
    if (videoExists){
        const result = await VideosManager.deleteVideoByVideosId(video_id);
        res.send(result);
    } else {
        res.status(404).send("Video not found");
    }
})


router.delete("/:video_id/comments/:comment_id", auth, async (req, res) =>{
    const video_id = parseInt(req.params.video_id);
    const videoExist = await VideosManager.getVideoById(video_id);
    const comment_id = parseInt(req.params.comment_id);
    const commentExists = await CommentManager.getCommentByItsId(comment_id);

    if (videoExist && commentExists) {
        const result = await CommentManager.deleteCommentById(comment_id);
        res.send(result);
    } else {
        res.status(404).send("Video or comment not found");
    }
})




module.exports = router;
