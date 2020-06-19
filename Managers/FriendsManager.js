const Manager = require('./DBManager')
const UserManager = require('./Users/UsersManager')
const FriendRequestManager = require("./FriendRequestManager")
const FriendNotification = require("../classes/Notifications/FriendNotification")
const NotificationManager = require("./ExternalManagers/NotificationManager")
const Joi  = require('joi')

const friends = 'friends';

class FriendsManager {
    async getRelations() {
        try {
            return Manager.getRows(friends);
        } catch (e) {
            console.log(e);
        }
    }

    async getAmountOfRelations(){
        const relations = await this.getRelations();
        const amount = relations.length / 2;
        return amount;
    }

    async getRelationById(id) {
        return await Manager.getIdFromTable(id, friends);
    }

    async getRelationByIds(id1, id2) {
        const condition = " id1 = " + id1 + " and " + " id2 = " + id2;
        const response = await Manager.getAllRowsWithCondition(friends, condition);
        return response;
    }

    async doesRelationExistBetween(id1, id2) {
        const array = await this.getRelationByIds(id1, id2);
        return array.length > 0;
    }

    async getAllFriendsFromUser(id) {
        const relations = await this.getAllRelationsFromUser(id);
        const users = [];

        for (let relation of relations) {
            users.push(await UserManager.getUserById(relation.id2));
        }
        return users;
    }

    async getAllRelationsFromUser(id) {
        const text = 'SELECT * FROM friends WHERE id1 = ' + id;
        const res = await Manager.executeQueryInTableWithoutValues(text);
        console.log(res.rows);
        return res.rows;
    }

    //Evita la conexion con el auth para ganar velocidad.
    async getAmountOfFriendsFromUser(user_id){
        const relations = await this.getAllRelationsFromUser(user_id);
        return relations.length;
    }

    async insertRelationBetweenUsers(id1, id2) {
        const relationId1 = await this.insertRelation(id1, id2);
        const relationId2 = await this.insertRelation(id2, id1);
        return {relationId1, relationId2};
    }

    async insertRelation(id1, id2) {
        const id = await Manager.generateNewIdInTable(friends);
        const text = 'INSERT INTO friends(id, id1, id2) VALUES($1, $2, $3)';
        const values = [id, id1, id2];
        await Manager.executeQueryInTable(text, values);
        return id;
    }

    async deleteRelationByUsersId(id1, id2) {
        console.log("Deleting friendship (so sad :( )");
        const text = 'DELETE FROM friends WHERE id1 = ' + id1 + ' AND id2 = ' + id2;
        return await Manager.executeQueryInTableWithoutValues(text);
    }

    async deleteRelationBetweenUsers(id1, id2) {
        const user1 = await UserManager.getUserById(id1);
        const user2 = await UserManager.getUserById(id2);
        const relationExists = await this.doesRelationExistBetween(id1, id2);

        if (user1 && user2 && relationExists) {
            const res1 = await this.deleteRelationByUsersId(id1, id2);
            const res2 = await this.deleteRelationByUsersId(id2, id1);
            return {res1, res2};
        } else {
            return null;
        }
    }

    async deleteAllRelationsFromUser(user_id) {
        const condition = ' id1 = ' + user_id + ' OR id2 = ' + user_id;
        return await Manager.deleteAllRowsWithCondition(friends, condition);
    }

//valid: User1 and 2 exist, they aren't friends and there is a request from one to another.
//post: returns true if the relation is valid.
    async checkNewValidRelation(id1, id2) {
        const user1 = await UserManager.getUserById(id1);
        const user2 = await UserManager.getUserById(id2);
        const relation = await this.doesRelationExistBetween(id1, id2);
        const request = await FriendRequestManager.isThereAtLeastARequestBetweenUsers(id1, id2);

        return (user1 && user2 && request && !relation);
    }

//pre::
    async sendAcceptedRequestNotification(id1, id2) {
        const acceptor_name = await UserManager.getNameById(id1);
        const sender_name = await UserManager.getNameById(id2);
        const acceptor_id = id1;
        const data = {acceptor_id};

        const notification = {
            "title": "Solicitud de amistad aceptada!",
            "body": "El usuario: " + acceptor_name + " es ahora tu amigo.",
            "click-action": "friend_accept"
        }

        const friendNotification1 = await new FriendNotification(id2, notification, data);
        const notificationState = await NotificationManager.sendNotification(friendNotification1);
        return {data, notificationState};
    }

//valid: User1 and 2 exist, they aren't friends and there is a request from one to another.
//post: posts relation if its a valid one.
    async postRelation(data, res) {
        const id1 = parseInt(data.id1);
        const id2 = parseInt(data.id2);
        const newValidRelation = await this.checkNewValidRelation(id1, id2);

        if (newValidRelation) {
            await FriendRequestManager.deleteRequestsBetweenUsers(data.id1, data.id2);
            await this.sendAcceptedRequestNotification(data.id1, data.id2);
            const relationsIds = await this.insertRelationBetweenUsers(id1, id2);
            if (res !== null)
                res.send("Amistad agregada entre: " + id1 + "/" + id2);

            return relationsIds;
        } else {
            res.status(404).send("ID inexistente");
        }
    }

//post: id1 and id2 must be positive numbers.
    async validateInput(body) {
        const schema = {
            id1: Joi.number().positive().required(),
            id2: Joi.number().positive().required()
        }
        return Joi.validate(body, schema);
    }
}

const friendsManager = new FriendsManager();
module.exports = friendsManager;