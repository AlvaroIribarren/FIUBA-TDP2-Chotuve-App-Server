// const assert = require('chai').assert;
//
// const Manager = require("../.././databases/DBManager")
// const FriendManager = require("../.././databases/FriendsManager")
//
// let relations;
// let relation1;
// let relation2;
// const data = {
//     "id1": 1,
//     "id2": 2
// };
//
//
// describe('Friends test', async ()=> {
//     it('Add friend', async ()=>{
//         const users = await FriendManager.getRelations();
//         const amount = users.length;
//
//         relations = await FriendManager.postRelation(data, null);
//         const messages2 = await FriendManager.getRelations();
//         const amount2 = messages2.length;
//
//         assert.equal(amount+1, amount2);
//     });
//
//     it('Check first relation existance', async ()=>{
//         relation1 = await FriendManager.getRelationById(relations.id1);
//         assert.notEqual(relation1, null);
//     })
//
//     it('Check second relation existance', async ()=>{
//         relation2 = await FriendManager.getRelationById(relations.id2);
//         assert.notEqual(relation2, null);
//     })
//
//     it('Check first relation id existance', async() =>{
//         assert.property(relation1, 'id');
//     })
//
//     it('Check first relation id1 existance', async() =>{
//         assert.property(relation1, 'id1');
//     })
//
//     it('Check first relation id2 existance', async () =>{
//         assert.property(relation1, 'id2');
//     })
//
//     it('Check second relation id existance', async() =>{
//         assert.property(relation2, 'id');
//     })
//
//     it('Check second relation id1 existance', async() =>{
//         assert.property(relation2, 'id1');
//     })
//
//     it('Check second relation id2 existance', async () =>{
//         assert.property(relation2, 'id2');
//     })
//
//     it('Check first relation info: id1', async ()=>{
//         const id1FromDB = relation1.id1;
//         assert.equal(id1FromDB, data.id1);
//     });
//
//     it('Check first relation info: id2', async ()=>{
//         const id2FromDB = relation1.id2;
//         assert.equal(id2FromDB, data.id2);
//     });
//
//     it('Check second relation info: id1', async ()=>{
//         const id1FromDB = relation2.id1;
//         assert.equal(id1FromDB, data.id2);
//     });
//
//     it('Check second relation info: id2', async ()=>{
//         const id2FromDB = relation2.id2;
//         assert.equal(id2FromDB, data.id1);
//     });
//
//     it('Delete message', async () =>{
//         const messages = await FriendManager.getRelations();
//         const amount = messages.length;
//         await FriendManager.deleteRelation(data.id1, data.id2);
//         const newMessages = await FriendManager.getRelations();
//         const newAmount = newMessages.length;
//         assert.equal(amount-1, newAmount);
//     })
// });