const assert = require('chai').assert;

const Manager = require("../Managers/DBManager")
const MessageManager = require("../Managers/MessagesManager")


let messageId;
let messageFromDB;
const sender_id = 1;
const receiver_id = 2;
const messageText = "hi";
const timeText = "asd";

describe('App', async ()=> {
    it('Add message', async ()=>{
        const messages = await MessageManager.getAllMessages();
        const amount = messages.length;
        const id = await MessageManager.insertMessage(sender_id, receiver_id, messageText, timeText);
        const messages2 = await MessageManager.getAllMessages();
        const amount2 = messages2.length;

        messageId = id;
        assert.equal(amount+1, amount2);
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

    it('Check message info: sender_id', async ()=>{
        const senderIdFromDB = messageFromDB.sender_id;
        assert.equal(senderIdFromDB, sender_id);
    });

    it('Check message info: receiver_id', async ()=>{
        const receiverIdFromDB = messageFromDB.receiver_id;
        assert.equal(receiverIdFromDB, receiver_id);
    });


    it('Check message info: message', async ()=>{
        const message = messageFromDB.message;
        assert.equal(message, messageText);
    });


    it('Check message info: time', async ()=>{
        const timeFromDB = messageFromDB.time;
        assert.equal(timeFromDB, timeText);
    });

    it('Delete message', async () =>{
        const messages = await MessageManager.getAllMessages();
        const amount = messages.length;
        await MessageManager.deleteMessageByItsId(messageId);
        const newMessages = await MessageManager.getAllMessages();
        const newAmount = newMessages.length;
        assert.equal(amount-1, newAmount);
    })
});