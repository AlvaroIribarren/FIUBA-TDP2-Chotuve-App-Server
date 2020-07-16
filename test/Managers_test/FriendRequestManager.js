const assert = require('chai').assert;

const Manager = require("../../Managers/DBManager")
const FriendRequestManager = require("../../Managers/FriendRequestManager")
const UserManager = require("../../Managers/Users/UsersManager")

let friendRequestId = 0;
let friendRequest;
let sender_id;
let receiver_id;
let data;

UserManager.getUsersFromDB().then((users)=>{
    sender_id = users[0].id;
    receiver_id = users[1].id;
    data = {
        "sender_id": sender_id,
        "receiver_id": receiver_id
    };
})

describe('Friend request test', async function () {
    this.timeout(30000);
    it('Add request', async ()=>{
        const length_a1 = await FriendRequestManager.getAmountOfRequests();
        const length_b1 = await FriendRequestManager.getAmountOfRequestsSentById(sender_id);
        const length_c1 = await FriendRequestManager.getAmountOfRequestsReceivedByUser(receiver_id);

        friendRequestId = await FriendRequestManager.postRequest(data, null);

        const length_a2 = await FriendRequestManager.getAmountOfRequests();
        const length_b2 = await FriendRequestManager.getAmountOfRequestsSentById(sender_id);
        const length_c2 = await FriendRequestManager.getAmountOfRequestsReceivedByUser(receiver_id);

        assert.equal(length_a1+1, length_a2);
        assert.equal(length_b1+1, length_b2);
        assert.equal(length_c1+1, length_c2);
    });

    it('Check request existance', async () => {
        friendRequest = await FriendRequestManager.getRequestById(friendRequestId);
        const actualRequest = await FriendRequestManager.getRequestSentBySenderToReceiver(sender_id, receiver_id);
        assert.isNotNull(actualRequest);
        assert.isNotNull(friendRequest);
    })

    it('Check sender_id existance', async () =>{
        assert.property(friendRequest, 'sender_id');
    })

    it('Check receiver_id existance', async () =>{
        assert.property(friendRequest, 'receiver_id');
    })

    it('Delete friendRequest', async () =>{
        const length_a1 = await FriendRequestManager.getAmountOfRequests();
        const length_b1 = await FriendRequestManager.getAmountOfRequestsSentById(sender_id);
        const length_c1 = await FriendRequestManager.getAmountOfRequestsReceivedByUser(receiver_id);

        friendRequestId = await FriendRequestManager.deleteRequestFromSenderToReceiver(sender_id, receiver_id);

        const length_a2 = await FriendRequestManager.getAmountOfRequests();
        const length_b2 = await FriendRequestManager.getAmountOfRequestsSentById(sender_id);
        const length_c2 = await FriendRequestManager.getAmountOfRequestsReceivedByUser(receiver_id);

        assert.equal(length_a1, length_a2+1);
        assert.equal(length_b1, length_b2+1);
        assert.equal(length_c1, length_c2+1);
    })

    it('Testing another delete', async() => {
        const lenght1 = await FriendRequestManager.getAmountOfRequests();
        await FriendRequestManager.postRequest(data, null);
        const length2 = await FriendRequestManager.getAmountOfRequests();
        assert.equal(lenght1+1, length2);
        await FriendRequestManager.deleteRequestsBetweenUsers(sender_id, receiver_id);
        const length3 = await FriendRequestManager.getAmountOfRequests();
        assert.equal(lenght1, length3);
    })
});