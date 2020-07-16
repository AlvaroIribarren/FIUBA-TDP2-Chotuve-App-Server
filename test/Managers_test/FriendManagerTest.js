const assert = require('chai').assert;

const FriendManager = require("../../Managers/FriendsManager")
const FriendRequestManager = require("../../Managers/FriendRequestManager")
const UserManager = require("../../Managers/Users/UsersManager")

let relation1;
let relation2;
let relationId1;
let relationId2;

let data;
let request_data;

UserManager.getUsersFromDB().then((users)=>{
    sender_id = users[0].id;
    receiver_id = users[1].id;
    request_data = {
        "sender_id": sender_id,
        "receiver_id": receiver_id
    };

    data = {
        "id1": sender_id,
        "id2": receiver_id
    };
})


describe('Friends test', async function () {
    this.timeout(30000);
    it('Add friend', async ()=>{
        const length1 = await FriendManager.getAmountOfRelations();
        const amountOfFriendsOfA1 = await FriendManager.getAmountOfFriendsFromUser(data.id1);
        const amountOfFriendsOfB1 = await FriendManager.getAmountOfFriendsFromUser(data.id2);
        await FriendRequestManager.postRequest(request_data, null);

        const error = await FriendManager.validateInput(data).error;
        assert.isUndefined(error);
        const relationsIds = await FriendManager.postRelation(data, null);
        relationId1 = relationsIds.relationId1;
        relationId2 = relationsIds.relationId2;

        const length2 = await FriendManager.getAmountOfRelations();
        const amountOfFriendsOfA2 = await FriendManager.getAmountOfFriendsFromUser(data.id1);
        const amountOfFriendsOfB2 = await FriendManager.getAmountOfFriendsFromUser(data.id1);

        assert.equal(length1+1, length2);
        assert.equal(amountOfFriendsOfA1+1, amountOfFriendsOfA2);
        assert.equal(amountOfFriendsOfB1+1, amountOfFriendsOfB2);
    });

    it('Check first relation existance', async ()=>{
        relation1 = await FriendManager.getRelationById(relationId1);
        assert.isNotNull(relation1);
    })

    it('Check second relation existance', async ()=>{
        relation2 = await FriendManager.getRelationById(relationId2);
        assert.isNotNull(relation2);
    })

    it('Check first relation id existance', async() =>{
        assert.property(relation1, 'id');
    })

    it('Check first relation id1 existance', async() =>{
        assert.property(relation1, 'id1');
    })

    it('Check first relation id2 existance', async () =>{
        assert.property(relation1, 'id2');
    })

    it('Check second relation id existance', async() =>{
        assert.property(relation2, 'id');
    })

    it('Check second relation id1 existance', async() =>{
        assert.property(relation2, 'id1');
    })

    it('Check second relation id2 existance', async () =>{
        assert.property(relation2, 'id2');
    })

    it('Check first relation info: id1', async ()=>{
        const id1FromDB = relation1.id1;
        assert.equal(id1FromDB, data.id1);
    });

    it('Check first relation info: id2', async ()=>{
        const id2FromDB = relation1.id2;
        assert.equal(id2FromDB, data.id2);
    });

    it('Check second relation info: id1', async ()=>{
        const id1FromDB = relation2.id1;
        assert.equal(id1FromDB, data.id2);
    });

    it('Check second relation info: id2', async ()=>{
        const id2FromDB = relation2.id2;
        assert.equal(id2FromDB, data.id1);
    });

    it('Delete friendship', async () =>{
        const length1 = await FriendManager.getAmountOfRelations();
        await FriendManager.deleteRelationBetweenUsers(data.id1, data.id2);
        const length2 = await FriendManager.getAmountOfRelations();
        assert.equal(length1-1, length2);
    })
});