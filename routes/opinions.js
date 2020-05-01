const express = require('express')
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const VideoManager = require("../databases/VideosManager")
const OpinionsManager = require("../databases/OpinionsManager")

const Joi = require("joi")

router.get("/", async (req, res) => {
    const relations = await OpinionsManager.getAllOpinions();
    res.send(relations);
})

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const relation = await OpinionsManager.getOpinionById(id);
    res.send(relation);
})

async function validateInput(body){
    const schema = {
        author_id: Joi.number().positive().required(),
        author_name: Joi.string().required(),
        video_id: Joi.number().positive().required(),
        positive_opinion: Joi.required(),
    }
    return Joi.validate(body, schema);
}

async function validateUserInfo(author_id, author_name){
    return await UserManager.checkCorrectIdAndName(author_id, author_name);
}

async function validateVideosExistance(video_id){
    return await VideoManager.getVideoById(video_id);
}


router.post("/", async (req, res) => {
    const error = await validateInput(req.body).error;
    if (!error){
        const author_id = parseInt(req.body.author_id);
        const author_name = req.body.author_name;
        const video_id = parseInt(req.body.video_id);
        const rightUserInfo = await validateUserInfo(author_id, author_name);
        const rightVideoInfo = await validateVideosExistance(video_id);

        if (rightUserInfo && rightVideoInfo){
            let positive_opinion = await OpinionsManager.turnBooleanIntoBit(req.body.positive_opinion);
            const id = await OpinionsManager.insertOpinion(author_id, author_name, video_id, positive_opinion);
            positive_opinion = await OpinionsManager.turnBitIntoBoolean(positive_opinion);
            res.send({id, author_id, author_name, video_id, positive_opinion});
        } else {
            res.status(404).send("User or videos information is incorrect or doesn't exist.");
        }
    } else {
        res.status(400).send(error.details[0].message);
    }
})

module.exports = router;
