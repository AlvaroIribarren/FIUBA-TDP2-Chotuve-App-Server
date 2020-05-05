const {Pool} = require('pg');
const Manager = require('./DBManager')
const UserManager = require('./UsersManager')
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

async function insertRelation(id1, id2) {
    const id = await Manager.generateNewIdInTable(friends);
    const text = 'INSERT INTO friends(id, id1, id2) VALUES($1, $2, $3)';
    const values = [id, id1, id2];
    await Manager.executeQueryInTable(text, values);
}

async function deleteRelationByUsersId(id1, id2) {
    console.log("Deleting friendship (so sad :( )");
    const text = 'DELETE FROM friends WHERE id1 = ' + id1 + ' AND id2 = ' + id2;
    await Manager.executeQueryInTableWithoutValues(text);
}

async function postRelation(data, res) {
    const id1 = parseInt(data.id1);
    const id2 = parseInt(data.id2);

    const user1 = await UserManager.getUserById(id1);
    const user2 = await UserManager.getUserById(id2);

    if (user1 && user2){
        await FriendsManager.insertRelation(id1, id2);
        await FriendsManager.insertRelation(id2, id1);
        res.send("Amistad agregada entre: " + id1 + "/" + id2);
    } else {
        res.status(404).send("ID inexistente");
    }
}

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

module.exports = FriendsManager;