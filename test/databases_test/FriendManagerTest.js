const assert = require('chai').assert;

const FriendManager = require("../../Managers/FriendsManager")
const UserManager = require("../../Managers/Users/UsersManager")

let relations;
let relation1;
let relation2;

const data = {
    "id1": 0,
    "id2": 0
};


describe('Friends test', async function () {
    this.timeout(15000);
    it('Add friend', async ()=>{
        const length1 = await FriendManager.getAmountOfRelations();
        const users = await UserManager.getUsersFromDB();

        data.id1 = users[0].id;
        data.id2 = users[1].id;

        relations = await FriendManager.insertRelationBetweenUsers(data.id1, data.id2);
        const length2 = await FriendManager.getAmountOfRelations();

        assert.equal(length1+1, length2);
    });

    it('Check first relation existance', async ()=>{
        relation1 = await FriendManager.getRelationById(relations.relationId1);
        assert.notEqual(relation1, null);
    })

    it('Check second relation existance', async ()=>{
        relation2 = await FriendManager.getRelationById(relations.relationId2);
        assert.notEqual(relation2, null);
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