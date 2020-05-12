const express = require('express')
const router = express.Router();
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


//todo: refactor
router.get("/:senderid/:receiverid", async (req, res) => {
    console.log("You asked for a certain request between users")
    const request = await RequestManager.getRequestByUsersIds(req.params.senderid, req.params.receiverid);
    res.send(request);
    console.log(request);
})

async function validateInput(body){
    const schema = {
        sender_id: Joi.number().positive().required(),
        receiver_id: Joi.number().positive().required()
    }

    return Joi.validate(body, schema);
}

router.post("/", async (req, res) => {
    const error = await validateInput(req.body).error;
    if (!error){
        await RequestManager.postRequest(req.body, res);
    }
})

//refactor
router.delete("/:senderid/:receiverid", async (req,res) => {
    const sender_id = parseInt(req.params.id1);
    const receiver_id = parseInt(req.params.id2);

    await RequestManager.deleteRequestFromSenderToReceiver(sender_id, receiver_id);
    res.send("Relation deleted");
})

module.exports = router;