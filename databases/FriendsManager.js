const Manager = require('./DBManager')
const UserManager = require('./UsersManager')
const RequestManager = require("./RequestManager")
const FriendNotification = require("../classes/Notifications/FriendNotification")
const NotificationManager = require("./NotificationManager")
const Joi  = require('joi')

const friends = 'friends'

async function getRelations(){
    try {
        const result = Manager.getRows(friends);
        return result;
    } catch(e){
        console.log(e);
    }
}

async function getRelationById(id){
    return await Manager.getIdFromTable(id, friends);
}

async function getRelationByUsersIds(id1, id2){
    console.log("Relation between 2 users");
    const text = 'SELECT * FROM friends WHERE id1 = ' + id1 + ' AND id2 = ' + id2;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows[0]);
    return res.rows[0];
}

async function getAllRelationsFromUser(id){
    const text = 'SELECT * FROM friends WHERE id1 = ' + id;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows);
    return res.rows;
}

async function getAllFriendsFromUser(id){
    const relations =  await getAllRelationsFromUser(id);
    const users = [];

    for (let relation of relations){
        users.push(await UserManager.getUserById(relation.id2));
    }
    return users;
}

async function insertRelationBetweenUsers(id1, id2){
    const relationId1 = await insertRelation(id1, id2);
    const relationId2 = await insertRelation(id2, id1);
    return {relationId1, relationId2};
}

async function insertRelation(id1, id2) {
    const id = await Manager.generateNewIdInTable(friends);
    const text = 'INSERT INTO friends(id, id1, id2) VALUES($1, $2, $3)';
    const values = [id, id1, id2];
    await Manager.executeQueryInTable(text, values);
    return id;
}

async function deleteRelationByUsersId(id1, id2) {
    console.log("Deleting friendship (so sad :( )");
    const text = 'DELETE FROM friends WHERE id1 = ' + id1 + ' AND id2 = ' + id2;
    await Manager.executeQueryInTableWithoutValues(text);
}

//valid: User1 and 2 exist, they aren't friends and there is a request from one to another.
//post: returns true if the relation is valid.
async function checkNewValidRelation(id1, id2){
    const user1 = await UserManager.getUserById(id1);
    const user2 = await UserManager.getUserById(id2);
    const relation = await getRelationByUsersIds(id1, id2);
    const request = await RequestManager.isThereAtLeastARequestBetweenUsers(id1, id2);

    return (user1 && user2 && request && !relation);
}

//pre::
async function sendAcceptedRequestNotification(id1, id2){
    const acceptor_name = await UserManager.getNameById(id1);
    const sender_name = await UserManager.getNameById(id2);
    const data = {sender_name, acceptor_name};

    const notification = {
        "title": "Solicitud de amistad aceptada!",
        "body": "El usuario: " + acceptor_name + " es ahora tu amigo.",
        "click-action": "friendship"
    }

    const friendNotification = await new FriendNotification(id2, notification, data);
    const notificationState = await NotificationManager.sendNotification(friendNotification);
    return {data, notificationState};
}

//valid: User1 and 2 exist, they aren't friends and there is a request from one to another.
//post: posts relation if its a valid one.
async function postRelation(data, res) {
    const id1 = parseInt(data.id1);
    const id2 = parseInt(data.id2);
    const newValidRelation = await checkNewValidRelation(id1, id2);

    if (newValidRelation){
        await RequestManager.deleteRequestsBetweenUsers(data.id1, data.id2);
        await sendAcceptedRequestNotification(data.id1, data.id2);
        const relationsIds = await insertRelationBetweenUsers(id1, id2);
        if (res !== null)
            res.send("Amistad agregada entre: " + id1 + "/" + id2);

        return relationsIds;
    } else {
        res.status(404).send("ID inexistente");
    }
}

//post: id1 and id2 must be positive numbers.
async function validateInput(body){
    const schema = {
        id1: Joi.number().positive().required(),
        id2: Joi.number().positive().required()
    }
    return Joi.validate(body, schema);
}


const FriendsManager = {}
FriendsManager.getRelations = getRelations;
FriendsManager.getRelationById = getRelationById;
FriendsManager.insertRelation = insertRelation;
FriendsManager.getRelationByUsersIds = getRelationByUsersIds;
FriendsManager.deleteRelation = deleteRelationByUsersId;
FriendsManager.getAllFriendsFromUser = getAllFriendsFromUser;
FriendsManager.postRelation = postRelation;
FriendsManager.validateInput = validateInput;
FriendsManager.sendAcceptedRequestNotification = sendAcceptedRequestNotification;

module.exports = FriendsManager;