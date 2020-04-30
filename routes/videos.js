const express = require('express')
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const FriendsManager = require("../databases/FriendsManager")
const VideosManager = require("../databases/VideosManager")
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

// router.get("/:id1/:id2", async (req, res) => {
//     console.log("You asked for a certain relation between users")
//     const relation = await VideosManager.getRelationByUsersIds(req.params.id1, req.params.id2);
//     res.send(relation);
//     console.log(relation);
// })

async function validateInput(body){
    const schema = {
        authorid: Joi.number().positive().required(),
        authorname: Joi.string().required()
    }
    return Joi.validate(body, schema);
}

// title = db.Column(db.String(100))
// description = db.Column(db.String(1000))
// url = db.Column(db.String(250))
// location = db.Column(db.String(200))
// public = db.Column(db.Boolean)
// authorid = db.Column(db.Integer)

//todo: validate input
router.post("/", async (req, res) => {
    //await validateInput(req.body);
    const author_id = parseInt(req.body.author_id);
    const author_name = req.body.author_name;
    const title = req.body.title;
    const description = req.body.description;
    const location = req.body.location;
    let public = req.body.public;
    
    if (public) {
        public = 1;
    } else {
        public = 0;
    }
    const url = req.body.url;

    const id = await VideosManager.insertVideo(author_id, author_name, title, description, location, public, url);
    res.send({id, author_id, author_name, title, description, public, url, location});
})

router.delete("/:id1/:id2", async (req,res) => {
    const id1 = parseInt(req.params.id1);
    const id2 = parseInt(req.params.id2);

    await FriendsManager.deleteRelation(id1, id2);
    await FriendsManager.deleteRelation(id2, id1);

    res.send("Relation deleted");
})

module.exports = router;
