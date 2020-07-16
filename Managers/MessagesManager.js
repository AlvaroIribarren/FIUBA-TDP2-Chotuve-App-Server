const Manager = require('./DBManager')
const UserManager = require('./Users/UsersManager')
const NotificationManager = require("./ExternalManagers/NotificationManager")
const FriendManager = require("./FriendsManager")
const MessageNotification = require("../classes/Notifications/MessageNotification")
const Joi = require('joi')

const HOURS_DIFFERENCE  = 3;
const messages = 'messages'

class MessagesManager {
//post: returns all messages in db.
    async getAllMessages() {
        try {
            return Manager.getRows(messages);
        } catch (e) {
            console.log(e);
        }
    }

    async getAmountOfMessages(){
        const allMessages = await this.getAllMessages();
        return allMessages.length;
    }

    async getMessageByItsId(id) {
        return await Manager.getIdFromTable(id, messages);
    }

//post: returns an array of messages sent by id1 to id2.
    async getAllMessagesSentById1ToId2(user_id1, user_id2) {
        const condition = "sender_id = " + user_id1 + " AND " + "receiver_id = " + user_id2;
        return await Manager.getAllRowsWithCondition(messages, condition);
    }

//pre: receives message's information which was previously checked.
//post: inserts message in database.
    async insertMessage(sender_id, receiver_id, message, time) {
        const id = await Manager.generateNewIdInTable(messages);
        const text = 'INSERT INTO messages(id, sender_id, receiver_id, message, time) ' +
            'VALUES($1, $2, $3, $4, $5)';
        const values = [id, sender_id, receiver_id, message, time];
        await Manager.executeQueryInTable(text, values);
        return id;
    }

    async deleteMessageByItsId(id) {
        console.log("Deleting video");
        const condition = 'id = ' + id;
        await Manager.deleteAllRowsWithCondition(messages, condition);
    }

//pre: no pre conditions
//post: deletes all messages by user, if none, it does nothing.
    async deleteAllMessagesSentByUser(sender_id) {
        const condition = 'sender_id = ' + sender_id;
        return await Manager.deleteAllRowsWithCondition(messages, condition);
    }

    async deleteAllMessagesReceivedByUser(receiver_id) {
        const condition = ' receiver_id = ' + receiver_id;
        return await Manager.deleteAllRowsWithCondition(messages, condition);
    }

    async deleteAllMessagesWithUserInvolved(user_id) {
        await this.deleteAllMessagesSentByUser(user_id);
        await this.deleteAllMessagesReceivedByUser(user_id);
    }

//pre: users ids have been checked
//post: deletes all messages sent by id1 to id2
    async deleteAllMessagesSentById1ToId2(id1, id2) {
        const condition = "sender_id = " + id1 + " AND " + "receiver_id = " + id2;
        return await Manager.deleteAllRowsWithCondition(messages, condition);
    }

//pre: users ids have been checked
//post: deletes all messages sent by id1 to id2
    async deleteAllMessagesBetweenUsers(id1, id2) {
        const res1 = await this.deleteAllMessagesSentById1ToId2(id1, id2);
        const res2 = await this.deleteAllMessagesSentById1ToId2(id2, id1);
        return {res1, res2};
    }

//post: returns true if user exists.
    async validateUsersExistance(id) {
        return await UserManager.getUserById(id);
    }

//post: returns actual time as a parsed string.
    async getActualTime() {
        const date = new Date();
        const hours = date.getHours() - HOURS_DIFFERENCE;
        date.setHours(hours);
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }


//pre: receives message's information
//post: creates notification, sends it and returns it's state.
    async sendMessageNotification(sender_id, receiver_id, message, time) {
        const sender_name = await UserManager.getNameById(sender_id);
        const data = {sender_id};

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
    async postMessage(data, res) {
        const sender_id = data.sender_id;
        const receiver_id = data.receiver_id;
        const message = data.message;
        const time = await this.getActualTime();

        const rightSenderInfo = await this.validateUsersExistance(sender_id);
        const rightReceiverInfo = await this.validateUsersExistance(receiver_id);
        const areFriends = await FriendManager.doesRelationExistBetween(sender_id, receiver_id);

        if (rightSenderInfo && rightReceiverInfo && areFriends) {
            const id = await this.insertMessage(sender_id, receiver_id, message, time);
            if (res) {
                const state = await this.sendMessageNotification(sender_id, receiver_id, message, time);
                res.send({id, sender_id, receiver_id, message, time, state});
            }
            return id;
        } else {
            if (res)
                res.status(404).send("One of the users doesn't exist.");
        }
    }

//post: returns a Joi object, if Joi.error is null, then info was valid.
    async validateInput(body) {
        const schema = {
            sender_id: Joi.number().positive().required(),
            receiver_id: Joi.number().positive().required(),
            message: Joi.string().required()
        }
        return Joi.validate(body, schema);
    }
}

const messagesManager = new MessagesManager();
module.exports = messagesManager;