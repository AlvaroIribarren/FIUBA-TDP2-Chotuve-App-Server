const express = require('express')
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const FriendManager = require("../databases/FriendsManager")
const VideosManager = require("../databases/VideosManager")
const TokenManager = require("../databases/TokensManager")
const RequestManager = require("../databases/RequestManager")

//pre:
//post: sends all users. Sends nothing if empty.
router.get("/", async (req, res) =>{
    try {
        const users = await UserManager.getUsers();
        console.log(users);
        res.send(users);
    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
})

//pre:
//post: sends the user if he exists. Sends an error if he doesn't
router.get("/:id", async (req, res) =>{
    const id = parseInt(req.params.id);
    const user = await UserManager.getUserById(id);
    if(user)
        res.send(user);
    else
        res.status(404).send("User not found");
})


//pre: user exists
//post: sends all friend from user id.
router.get("/:id/friends", async (req, res) => {
    const userId = parseInt(req.params.id);
    const userExists = await UserManager.getUserById(userId);
    if (userExists){
        const friends = await FriendManager.getAllFriendsFromUser(userId);
        res.send(friends);
    } else {
        res.status(404).send("User with id: " + userId + " not found.");
    }
})

//pre: user exists.
//post: sends all videos from user id.
router.get("/:id/videos", async (req, res) => {
    const userId = parseInt(req.params.id);
    const userExists = await UserManager.getUserById(userId);
    if (userExists){
        const videos = await VideosManager.getAllVideosFromUser(userId);
        res.send(videos)
    } else {
        res.status(404).send("User with id: " + userId + " not found.");
    }
})

//pre: user exists.
//post: sends token from user.
router.get("/:id/token", async (req, res) => {
    const userId = parseInt(req.params.id);
    const userExists = await UserManager.getUserById(userId);
    if (userExists){
        const token = await TokenManager.getTokenByUserId(userId);
        res.send(token)
    } else {
        res.status(404).send("User with id: " + userId + " not found.");
    }
})

//pre: id1 and id2 users exist.
//post: sends all messages sent by id1 to id2.
router.get("/:id1/messages/:id2", async (req,res) => {
    const id1 = parseInt(req.params.id1);
    const id2 = parseInt(req.params.id2);

    const user1Exists = await UserManager.getUserById(id1);
    const user2Exists = await UserManager.getUserById(id2);

    if (user1Exists && user2Exists){
        const messages1 = await MessageManager.getAllMessagesSentById1ToId2(id1, id2);
        const messages2 = await MessageManager.getAllMessagesSentById1ToId2(id2, id1);

        const messages = messages1.concat(messages2);
        res.send(messages);
    } else {
        res.status(404).send("User with id: " + id1 + " or " + id2 + " not found.");
    }
})

router.get("/:receiver_id/requests", async (req,res) => {
    const receiver_id = parseInt(req.params.receiver_id);
    const requests = await RequestManager.getAllRequestsReceivedByUserId(receiver_id);
    const listToReturn = [];
    for (let request of requests){
        const user = await UserManager.getUserById(request.sender_id);
        const data = {
            "sender_id": request.sender_id,
            "sender_name": user.name
        }
        listToReturn.push(data);
    }
    res.send(listToReturn);
});


router.post('/', async (req, res) => {
    const error = UserManager.validateUser(req.body).error;
    if (!error){
        await UserManager.postUser(req.body, res);
    } else {
        res.status(400).send(error.details[0].message);
    }
})

router.post('/:receiver_id/friends', async (req, res) => {
    const data = {
        id1: parseInt(req.params.receiver_id),  //id1: received/accepted request
        id2: parseInt(req.body.sender_id)       //id2: sent request
    }
    const error = await FriendManager.validateInput(data).error;
    if (!error){
        await FriendManager.postRelation(data, res);
    } else {
        res.status(400).send("Datos invalidos o inexistentes");
    }
})

router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const error = await UserManager.validateUserWithOptionalFields(req.body).error;
    const user = await UserManager.getUserById(id);

    if(!error && user){
        const data = req.body;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                console.log(key + " -> " + data[key]);
                await UserManager.editUser(key, data[key], 'id', id);
            }
        }
        res.send("Se deberia haber hecho bien");
    } else {
        res.status(400).send("Error en validacion: " + error.details[0].message);
    }
})

router.post("/:receiver_id/requests", async (req, res)=> {
    const data = {
        sender_id: parseInt(req.body.sender_id),
        receiver_id: parseInt(req.params.receiver_id)
    }
    await RequestManager.postRequest(data, res);
});

router.delete('/:id', async (req, res) => {
    await checkIdsExistence(req, res);
    const id = parseInt(req.params.id);
    await UserManager.deleteUserById(id);
    res.status(200).send("User eliminated");
})

module.exports = router;
