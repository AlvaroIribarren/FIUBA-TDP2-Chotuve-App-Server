const Manager = require('./DBManager')
const FriendsManager = require('./RequestManager')
const UserManager = require('./UsersManager')

const requests = 'requests'

async function getRequests(){
    try {
        const result = Manager.getRows(requests);
        return result;
    } catch(e){
        console.log(e);
    }
}

async function getRequestById(id){
    return await Manager.getIdFromTable(id, requests);
}

async function getAllRequestsSentById(sender_id){
    const text = 'SELECT * FROM requests WHERE sender_id = ' + sender_id;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows);
    return res.rows;
}

async function getRequestSentBySenderToReceiver(sender_id, receiver_id){
    const condition1 = "sender_id = " + sender_id;
    const condition2 = "receiver_id = " + receiver_id;
    const condition = condition1 + " AND " + condition2;
    const rows = await Manager.getAllRowsWithCondition(requests, condition);
    return rows;
}

async function getAllRequestsReceivedByUserId(receiver_id){
    const text = 'SELECT * FROM requests WHERE receiver_id = ' + receiver_id;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows);
    return res.rows;
}

async function insertRequest(sender_id, receiver_id) {
    const id = await Manager.generateNewIdInTable(requests);
    const text = 'INSERT INTO requests(id, sender_id, receiver_id) VALUES($1, $2, $3)';
    const values = [id, sender_id, receiver_id];
    await Manager.executeQueryInTable(text, values);
}

//todo: borrar bidireccionalmente.
async function deleteRequestFromSenderToReceiver(id1, id2) {
    console.log("Deleting friendship (so sad :( )");
    const text = 'DELETE FROM requests WHERE sender_id = ' + id1 + ' AND receiver_id = ' + id2;
    await Manager.executeQueryInTableWithoutValues(text);
}

async function getRequestByUsersIds(sender_id, receiver_id){
    console.log("Relation between 2 users");
    const text = 'SELECT * FROM requests WHERE sender_id = ' + sender_id + ' AND receiver_id = ' + receiver_id;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows[0]);
    return res.rows[0];
}

async function postRequest(data, res){
    const sender_id = parseInt(data.sender_id);
    const receiver_id = parseInt(data.receiver_id);

    const user1 = await UserManager.getUserById(sender_id);
    const user2 = await UserManager.getUserById(receiver_id);

    if (user1 && user2){
        await RequestManager.insertRequest(sender_id, receiver_id);
        res.send("Id :" + sender_id + " envia request a: " + receiver_id);
    } else {
        res.status(404).send("ID inexistente");
    }
}

const RequestManager = {}
RequestManager.getRequests = getRequests;
RequestManager.getRequestById = getRequestById;
RequestManager.insertRequest = insertRequest;
RequestManager.getRequestByUsersIds = getRequestByUsersIds;
RequestManager.deleteRequestFromSenderToReceiver = deleteRequestFromSenderToReceiver;
RequestManager.getAllRequestsSentById = getAllRequestsSentById;
RequestManager.getAllRequestsReceivedByUserId = getAllRequestsReceivedByUserId;
RequestManager.postRequest = postRequest;
RequestManager.getRequestSentBySenderToReceiver = getRequestSentBySenderToReceiver;

module.exports = RequestManager;