const express = require('express')
const router = express.Router();
const UserManager = require("../databases/UsersManager")
const RequestManager = require("../databases/RequestManager")

const Joi = require("joi")

router.get("/", async (req, res) => {
    const requests = await RequestManager.getRequests();
    res.send(requests);
})

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const relation = await RequestManager.getRequestById(id);
    res.send(relation);
})



router.get("/:senderid/:receiverid", async (req, res) => {
    console.log("You asked for a certain request between users")
    const request = await RequestManager.getRequestByUsersIds(req.params.senderid, req.params.receiverid);
    res.send(request);
    console.log(request);
})

async function validateInput(body){
    const schema = {
        senderid: Joi.number().positive().required(),
        receiverid: Joi.number().positive().required()
    }

    return Joi.validate(body, schema);
}

router.post("/", async (req, res) => {
    await validateInput(req.body);
    const senderid = parseInt(req.body.senderid);
    const receiverid = parseInt(req.body.receiverid);

    const user1 = await UserManager.getUserById(senderid);
    const user2 = await UserManager.getUserById(receiverid);

    if (user1 && user2){
        await RequestManager.insertRequest(senderid, receiverid);
        res.send("Id :" + senderid + " envia request a: " + receiverid);
    } else {
        res.status(404).send("ID inexistente");
    }
})

router.delete("/:senderid/:receiverid", async (req,res) => {
    const senderid = parseInt(req.params.id1);
    const receiverid = parseInt(req.params.id2);

    await RequestManager.deleteRequestFromSenderToReceiver(senderid, receiverid);
    res.send("Relation deleted");
})

module.exports = router;