const Manager = require('./DBManager')
const FriendsManager = require('./RequestManager')

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

async function getAllRequestsSentById(senderid){
    const text = 'SELECT * FROM requests WHERE senderid = ' + senderid;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows);
    return res.rows;
}

async function insertRequest(senderid, receiverid) {
    const id = await Manager.generateNewIdInTable(requests);
    const text = 'INSERT INTO requests(id, senderid, receiverid) VALUES($1, $2, $3)';
    const values = [id, senderid, receiverid];
    await Manager.executeQueryInTable(text, values);
}

//todo: borrar bidireccionalmente.
async function deleteRequestFromSenderToReceiver(id1, id2) {
    console.log("Deleting friendship (so sad :( )");
    const text = 'DELETE FROM requests WHERE senderid = ' + id1 + ' AND receiverid = ' + id2;
    await Manager.executeQueryInTableWithoutValues(text);
}

async function getRequestByUsersIds(senderid, receiverid){
    console.log("Relation between 2 users");
    const text = 'SELECT * FROM requests WHERE senderid = ' + senderid + ' AND receiverid = ' + receiverid;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows[0]);
    return res.rows[0];
}

const RequestManager = {}
RequestManager.getRequests = getRequests;
RequestManager.getRequestById = getRequestById;
RequestManager.insertRequest = insertRequest;
RequestManager.getRequestByUsersIds = getRequestByUsersIds;
RequestManager.deleteRequestFromSenderToReceiver = deleteRequestFromSenderToReceiver;
RequestManager.getAllRequestsSentById = getAllRequestsSentById;

module.exports = RequestManager;