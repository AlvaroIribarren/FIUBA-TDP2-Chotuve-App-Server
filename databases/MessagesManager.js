const Manager = require('./DBManager')
const UserManager = require('./UsersManager')
const VideoManager = require('./VideosManager')
const NotificationManager = require("./NotificationManager")
const FriendManager = require("./FriendsManager")
const MessageNotification = require("../classes/Notifications/MessageNotification")
const Joi = require('joi')

const HOURS_DIFFERENCE  = 3;
const messages = 'messages'

//post: returns all messages in db.
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

//post: returns array of messages sent by user.
async function getAllMessagesSentByUser(sender_id){
    const condition = "sender_id = " + sender_id;
    const rows = await Manager.getAllRowsWithCondition(messages, condition);
    return rows;
}

//post: returns an array of messages sent by id1 to id2.
async function getAllMessagesSentById1ToId2(user_id1, user_id2){
    const condition1 = "sender_id = " + user_id1;
    const condition2 = "receiver_id = " + user_id2;
    const condition = condition1 + " AND " + condition2;
    const rows = await Manager.getAllRowsWithCondition(messages, condition);
    return rows;
}

//pre: receives message's information which was previously checked.
//post: inserts message in database.
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

//pre: no pre conditions
//post: deletes all messages by user, if none, it does nothing.
async function deleteAllMessagesSentByUser(sender_id){
    console.log("Deleting all messages");
    const text = 'DELETE FROM friends WHERE sender_id = ' + sender_id;
    await Manager.executeQueryInTableWithoutValues(text);
}

//post: returns true if user exists.
async function validateUsersExistance(id){
    return await UserManager.getUserById(id);
}

//post: returns actual time as a parsed string.
async function getActualTime(){
    const date = new Date();
    const hours = date.getHours() - HOURS_DIFFERENCE;
    date.setHours(hours);
    const timeAsString = date.toISOString().replace(/T/, ' ').
                                            replace(/\..+/, '');
    return timeAsString;
}


//pre: receives message's information
//post: creates notification, sends it and returns it's state.
async function sendMessageNotification(sender_id, receiver_id, message, time){
    const sender_name = await UserManager.getNameById(sender_id);
    const data = { sender_name, message, time};

    const notification = {
        "title": "Mensaje de: " + sender_name,
        "body": message,
        "click-action": "message"
    }

    const mNotification = await new MessageNotification(receiver_id, notification, data);
    const notificationState = await NotificationManager.sendNotification(mNotification);
    return {data, notificationState};
}

//pre: users exist and they're friends
//post: message is sent with its notification
async function postMessage(data, res){
    const sender_id = data.sender_id;
    const receiver_id = data.receiver_id;
    const message = data.message;
    const time = await getActualTime();

    const rightSenderInfo = await validateUsersExistance(sender_id);
    const rightReceiverInfo = await validateUsersExistance(receiver_id);
    const areFriends = await FriendManager.getRelationByUsersIds(sender_id, receiver_id);

    if (rightSenderInfo && rightReceiverInfo && areFriends){
        const id = await insertMessage(sender_id, receiver_id, message, time);
        const state = await sendMessageNotification(sender_id, receiver_id, message, time);
        res.send({id, sender_id, receiver_id, message, time, state});
    } else {
        res.status(404).send("One of the users doesn't exist.");
    }
}

//post: returns a Joi object, if Joi.error is null, then info was valid.
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