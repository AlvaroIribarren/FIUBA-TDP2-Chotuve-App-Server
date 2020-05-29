const Manager = require('./DBManager')
const UserManager = require('./Users/UsersManager')
const NotificationManager = require("./ExternalManagers/NotificationManager")
const RequestNotification = require(".././classes/Notifications/RequestNotification")

const requests = 'requests'

class FriendRequestManager {
    async getRequests() {
        try {
            const result = Manager.getRows(requests);
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getRequestById(id) {
        return await Manager.getIdFromTable(id, requests);
    }

    async getAllRequestsSentById(sender_id) {
        const text = 'SELECT * FROM requests WHERE sender_id = ' + sender_id;
        const res = await Manager.executeQueryInTableWithoutValues(text);
        console.log(res.rows);
        return res.rows;
    }

    async getRequestSentBySenderToReceiver(sender_id, receiver_id) {
        const condition1 = "sender_id = " + sender_id;
        const condition2 = "receiver_id = " + receiver_id;
        const condition = condition1 + " AND " + condition2;
        return await Manager.getAllRowsWithCondition(requests, condition);
    }

    async getAllRequestsReceivedByUserId(receiver_id) {
        const text = 'SELECT * FROM requests WHERE receiver_id = ' + receiver_id;
        const res = await Manager.executeQueryInTableWithoutValues(text);
        console.log(res.rows);
        return res.rows;
    }

    async isThereAtLeastARequestBetweenUsers(id1, id2) {
        const r1 = await this.getRequestSentBySenderToReceiver(id1, id2);
        const r2 = await this.getRequestSentBySenderToReceiver(id2, id1);
        return r1 || r2;
    }

    async insertRequest(sender_id, receiver_id) {
        const id = await Manager.generateNewIdInTable(requests);
        const text = 'INSERT INTO requests(id, sender_id, receiver_id) VALUES($1, $2, $3)';
        const values = [id, sender_id, receiver_id];
        await Manager.executeQueryInTable(text, values);
    }


    async deleteRequestFromSenderToReceiver(id1, id2) {
        console.log("Deleting friendship (so sad :( )");
        const condition = ' sender_id = ' + id1 + ' AND receiver_id = ' + id2;
        await Manager.deleteAllRowsWithCondition(requests, condition);
    }

    async deleteAllRequestsWhereUserIsInvolved(user_id) {
        const condition = ' sender_id = ' + user_id + ' OR receiver_id = ' + user_id;
        return await Manager.deleteAllRowsWithCondition(requests, condition);
    }

    async getRequestByUsersIds(sender_id, receiver_id) {
        console.log("Relation between 2 users");
        const text = 'SELECT * FROM requests WHERE sender_id = ' + sender_id + ' AND receiver_id = ' + receiver_id;
        const res = await Manager.executeQueryInTableWithoutValues(text);
        console.log(res.rows[0]);
        return res.rows[0];
    }


    async checkValidRequest(sender_id, receiver_id) {
        const user1 = await UserManager.getUserById(sender_id);
        const user2 = await UserManager.getUserById(receiver_id);

        //const relation = await getRelationByIds(sender_id, receiver_id);
        const request = await this.getRequestByUsersIds(sender_id, receiver_id);

        return (user1 && user2 && !request);
    }

    async postRequest(data, res) {
        const sender_id = parseInt(data.sender_id);
        const receiver_id = parseInt(data.receiver_id);

        const validRequest = await this.checkValidRequest(sender_id, receiver_id);
        if (validRequest) {
            await this.insertRequest(sender_id, receiver_id);
            const response = await this.sendRequestNotification(sender_id, receiver_id);
            res.send(response);
        } else {
            res.status(404).send("Request invalida, ids no validas, ya son amigos o ya se envio la request");
        }
    }

    async deleteRequestsBetweenUsers(id1, id2) {
        await this.deleteRequestFromSenderToReceiver(id1, id2);
        await this.deleteRequestFromSenderToReceiver(id2, id1);
    }

    async sendRequestNotification(sender_id, receiver_id) {
        const sender_name = await UserManager.getNameById(sender_id);
        const data = {sender_id};

        const notification = {
            "title": "Solicitud de amistad de: " + sender_name,
            "body": "El usuario " + sender_name + " quiere ser tu amigo :)",
            "click-action": "friend_request"
        }

        const rNotification = await new RequestNotification(receiver_id, notification, data);
        const notificationState = await NotificationManager.sendNotification(rNotification);
        return {data, notificationState};
    }
}

const friendRequestManager = new FriendRequestManager();
module.exports = friendRequestManager;