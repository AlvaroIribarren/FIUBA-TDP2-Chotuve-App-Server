const Manager = require('./DBManager')
const UserManager = require('./UsersManager')
const VideoManager = require('./VideosManager')
const Joi = require('joi')

const HOURS_DIFFERENCE  = 3;
const messages = 'messages'

async function getAllMessages(){
    try {
        const result = Manager.getRows(messages);
        return result;
    } catch(e){
        console.log(e);
    }
}

async function getMessageByItsId(id){
    return await Manager.getIdFromTable(id, messages);
}

async function getAllMessagesSentByUser(sender_id){
    //const text = 'SELECT * FROM messages WHERE sender_id = ' + sender_id;
    const condition = "sender_id = " + sender_id;
    const rows = await Manager.getAllRowsWithCondition(messages, condition);
    return rows;
}

async function getAllMessagesSentById1ToId2(id1, id2){
    const condition1 = "sender_id = " + id1;
    const condition2 = "receiver_id = " + id2;
    const condition = condition1 + " AND " + condition2;
    const rows = await Manager.getAllRowsWithCondition(messages, condition);
    return rows;
}

async function insertMessage(sender_id, receiver_id, message, time) {
    const id = await Manager.generateNewIdInTable(messages);
    const text = 'INSERT INTO messages(id, sender_id, receiver_id, message, time) ' +
        'VALUES($1, $2, $3, $4, $5)';
    const values = [id, sender_id, receiver_id, message, time];
    await Manager.executeQueryInTable(text, values);
    return id;
}

async function deleteMessageByItsId(id) {
    console.log("Deleting video");
    const text = 'DELETE FROM messages WHERE id = ' + id;
    await Manager.executeQueryInTableWithoutValues(text);
}

async function deleteAllMessagesSentByUser(sender_id){
    console.log("Deleting all messages");
    const text = 'DELETE FROM friends WHERE sender_id = ' + sender_id;
    await Manager.executeQueryInTableWithoutValues(text);
}


async function validateUsersExistance(id){
    return await UserManager.getUserById(id);
}

async function getActualTime(){
    const date = new Date();
    const hours = date.getHours() - HOURS_DIFFERENCE;
    date.setHours(hours);
    const timeAsString = date.toISOString().replace(/T/, ' ').
                                            replace(/\..+/, '');
    return timeAsString;
}

async function postMessage(data, res){
    const sender_id = data.sender_id;
    const receiver_id = data.receiver_id;
    const message = data.message;
    const time = await getActualTime();

    const rightSenderInfo = await validateUsersExistance(sender_id);
    const rightReceiverInfo = await validateUsersExistance(receiver_id);

    if (rightSenderInfo && rightReceiverInfo){
        const id = await insertMessage(sender_id, receiver_id, message, time);
        res.send({id, sender_id, receiver_id, message, time});
    } else {
        res.status(404).send("One of the users doesn't exist.");
    }
}

async function validateInput(body){
    const schema = {
        sender_id: Joi.number().positive().required(),
        receiver_id: Joi.number().positive().required(),
        message: Joi.string().required()
    }
    return Joi.validate(body, schema);
}


MessageManager = {};
MessageManager.getAllMessages = getAllMessages;
MessageManager.getMessageByItsId = getMessageByItsId;
MessageManager.getAllMessagesSentByUser = getAllMessagesSentByUser;
MessageManager.insertMessage = insertMessage;
MessageManager.deleteMessageByItsId = deleteMessageByItsId;
MessageManager.deleteAllMessagesSentByUser = deleteAllMessagesSentByUser;
MessageManager.postMessage = postMessage;
MessageManager.validateInput = validateInput;
MessageManager.getAllMessagesSentById1ToId2 = getAllMessagesSentById1ToId2;

module.exports = MessageManager;