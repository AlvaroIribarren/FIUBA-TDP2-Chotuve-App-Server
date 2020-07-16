const assert = require('chai').assert;

const MessageManager = require("../../Managers/MessagesManager")
const FriendManager = require("../../Managers/FriendsManager")

let messageId;
let messageFromDB;
let sender_id = 23;
let receiver_id = 28;

const data = {
    "sender_id" : sender_id,
    "receiver_id" : receiver_id,
    "message" : "hi"
}

describe('Message manager testing:', async function() {
    this.timeout(30000);
    it('Add message', async ()=>{
        await FriendManager.insertRelationBetweenUsers(sender_id, receiver_id);
        const length1 = await MessageManager.getAmountOfMessages();
        await MessageManager.validateInput(data);
        messageId = await MessageManager.postMessage(data, null);
        const length2 = await MessageManager.getAmountOfMessages();

        assert.equal(length1+1, length2);
    });

    it('Check message existance', async ()=>{
        messageFromDB = await MessageManager.getMessageByItsId(messageId);
        assert.notEqual(messageFromDB, null);
    })

    it('Check sender_id existance', async() =>{
        assert.property(messageFromDB, 'sender_id');
    })

    it('Check receiver_id existance', async () =>{
        assert.property(messageFromDB, 'receiver_id');
    })

    it('Check message property existance', async () =>{
        assert.property(messageFromDB, 'message');
    })

    it('Check time existance', async () =>{
        assert.property(messageFromDB, 'time');
    })

    it('Delete message', async () =>{
        const lenght1 = await MessageManager.getAmountOfMessages();
        await MessageManager.deleteMessageByItsId(messageId);
        const length2 = await MessageManager.getAmountOfMessages();
        assert.equal(lenght1-1, length2);
    })

    it('Delete messages between users', async ()=>{
        const length1 = await MessageManager.getAmountOfMessages();
        messageId = await MessageManager.postMessage(data, null);
        const length2 = await MessageManager.getAmountOfMessages();
        assert.equal(length1+1, length2);
        await MessageManager.deleteAllMessagesBetweenUsers(sender_id, receiver_id);
        const length3 = await MessageManager.getAmountOfMessages();
        assert.equal(length1, length3);
    });

    it('Deleting messages with user involved from sender point of view', async()=>{
        const length1 = await MessageManager.getAmountOfMessages();
        messageId = await MessageManager.postMessage(data, null);
        const length2 = await MessageManager.getAmountOfMessages();
        assert.equal(length1+1, length2);
        await MessageManager.deleteAllMessagesWithUserInvolved(sender_id);
        const length3 = await MessageManager.getAmountOfMessages();
        assert.equal(length1, length3);
    })

    it('Deleting messages with user involved from receiver point of view', async()=>{
        const length1 = await MessageManager.getAmountOfMessages();
        await MessageManager.postMessage(data, null);
        const length2 = await MessageManager.getAmountOfMessages();
        assert.equal(length1+1, length2);
        await MessageManager.deleteAllMessagesWithUserInvolved(receiver_id);
        const length3 = await MessageManager.getAmountOfMessages();
        assert.equal(length1, length3);
        await FriendManager.deleteRelationBetweenUsers(sender_id, receiver_id);
    })
});