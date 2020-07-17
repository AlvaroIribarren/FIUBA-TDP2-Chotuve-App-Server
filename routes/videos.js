const express = require('express');
const router = express.Router();
const UserManager = require("../Managers/Users/UsersManager")
const VideosManager = require("../Managers/Videos/VideosManager")
const CommentManager = require("../Managers/CommentsManager")
const ReactionManager = require("../Managers/Reactions/ReactionsManager")
const postReaction = require("../Managers/Reactions/ReactionsIndex")
const auth = require("../Middleware/auth")

const Joi = require("joi")

async function noSearchQuery(search){
    return search === undefined || search === null || search === "" || search === " ";
}

const sortArray = require("../Utils/sortByImportance");
const removeImportance = require("../Utils/removeImportance");

router.get("/", async(req, res) => {
    console.log("Entrando a videos");
    console.log("Desde videos: " + res.locals.sl_token);

    const requester_id = req.headers["requester-id"];       //Me fijo quien solicita los videos
    const requester_exists = await UserManager.doesUserExist(requester_id);

    if (requester_exists) {
        await UserManager.updateLastLogin(requester_id);        //Actualizo el último login del usuario
                                                                //Lo hago aca porque esta es la pantalla principal
        if (res.locals.sl_token) {
            const sl_token = res.locals.sl_token;
            res.header({"Sl-Token": sl_token});
        }

        let search = req.query.search_query;
        const videos = await VideosManager.getVideosWithImportance(requester_id);
        if (await noSearchQuery(search)) {
            await sortArray(videos);
            await removeImportance(videos);
            res.send(videos);
        } else {
            //Adentro se agrega la busqueda a la lista
            const filtratedVideos = await VideosManager.getSearchRelatedVideos(videos, search);
            await sortArray(filtratedVideos);
            await removeImportance(filtratedVideos);
            res.send(filtratedVideos);
        }
    }
})

router.get("/appServer", auth, async (req,res)=>{
    const videosInAppSv = await VideosManager.getVideosInAppServer();
    res.send(videosInAppSv);
})

router.get("/:id", auth, async (req, res) => {
    const id = parseInt(req.params.id);
    await VideosManager.addViewToVideo(id);
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

async function validateInputForPost(body){
    const schema = {
        author_id: Joi.number().positive().required(),
        title: Joi.string().required(),
        description: Joi.string(),
        location: Joi.string(),
        public_video: Joi.required(),
        url: Joi.string().required(),
        uuid: Joi.required(),
        video_size: Joi.required()
    }
    return Joi.validate(body, schema);
}

async function validateModifyVideo(body){
    const schema = {
        author_id: Joi.number().positive().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        public_video: Joi.required()
    }
    return Joi.validate(body, schema);
}

router.post("/", async (req, res) => {
    const error = await validateInputForPost(req.body).error;
    if (!error){
        await VideosManager.postVideo()
    } else {
        res.status(400).send(error.details[0].message);
    }
})

async function validateVideoInfo(video_id){
    const video = await VideosManager.doesVideoExist(video_id);
    return video.length > 0;
}

router.post("/:video_id/reactions", async (req, res) => {
    const error = await ReactionManager.validateInput(req.body).error;
    if (!error) {
        const author_id = req.body.author_id;
        const video_id = parseInt(req.params.video_id);
        const positive_reaction = req.body.positive_reaction;
        const rightVideoInfo = await validateVideoInfo(video_id);
        const userExists = await UserManager.doesUserExist(author_id);
        if (userExists && rightVideoInfo) {
            const data = {author_id, video_id, positive_reaction};
            await postReaction(data, res);
        } else {
            res.status(400).send("Video or user doesn't exist");
        }
    } else {
        res.status(400).send(error.details[0].message);
    }
})

router.post("/:video_id/comments", auth, async (req, res) => {
    const error = await CommentManager.validateInput(req.body).error;
    if (!error) {
        const author_id = req.body.author_id;
        const video_id = parseInt(req.params.video_id);
        const comment = req.body.comment;
        const data = {author_id, video_id, comment};
        await CommentManager.postComment(data, res);
    } else {
        res.status(400).send(error.details[0].message);
    }
})

router.put("/:video_id", async (req,res) => {
    const error = await validateModifyVideo(req.body).error;
    if (!error) {
        const video_id = parseInt(req.params.video_id);
        const videoToModify = await VideosManager.getVideoWithNoUrlById(video_id);
        const modifiedVideo = await req.body;
        const requester_id = parseInt(req.headers["requester-id"]);
        const isAllowedToModify = (requester_id === videoToModify.author_id);

        if (videoToModify && isAllowedToModify) {
            for (let key in modifiedVideo) {
                if (modifiedVideo.hasOwnProperty(key)) {
                    if (modifiedVideo[key] !== videoToModify[key]) {
                        const newValue = modifiedVideo[key];
                        await VideosManager.modifiyVideo(video_id, key, newValue);
                    }
                }
            }
        }
        const video = await VideosManager.getVideoById(video_id);
        res.send(video);
    }
})

router.put("/:video_id/enabled", async (req,res) => {
    const video_id = parseInt(req.params.video_id);
    const enabled = await VideosManager.isVideoEnabled(video_id);
    if (enabled) {
        await VideosManager.disableVideo(video_id);
        res.send("Video disabled");
    } else {
        await VideosManager.enableVideo(video_id);
        res.send("Video enabled");
    }
})

router.delete("/:video_id", async (req,res) => {
    const requester_id = parseInt(req.headers["requester-id"]);
    const video_id = parseInt(req.params.video_id);
    const videoExists = await VideosManager.getVideoById(video_id);
    const author_id = videoExists.author_id;
    const userAllowedToDelete = requester_id === author_id;
    if (videoExists && userAllowedToDelete){
        const result = await VideosManager.deleteVideoByVideosId(video_id);
        res.send(result);
    } else {
        if (!videoExists)
            res.status(404).send("Video not found or user is ");
        else if (!userAllowedToDelete) {
            res.status(401).send("User not allowed to delete video");
        } else {
            res.status(404).send("User not allowed to delete and video was not found");
        }
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
