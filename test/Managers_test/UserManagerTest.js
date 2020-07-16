const assert = require('chai').assert;

const Manager = require("../../Managers/DBManager")
const UserManager = require("../../Managers/Users/UsersManager")

let userId = 0;
let user;
const data = {
     "name" : 'Alvaro',
     "email" : 'alvarito@xalvaritox.com',
     "phone" : '1234567890',
     "sign_in_method": 'google',
     "firebase_token": "asdasdasd",
     "img_url" : 'asdasd',
     "img_uuid" : 'asdasd'
};


describe('Users test', async function () {
    this.timeout(30000);
    it('Add User', async ()=>{
        const length1 = await UserManager.getAmountOfUsers();
        userId = await UserManager.postUser(data, null);
        const length2 = await UserManager.getAmountOfUsers();

        assert.equal(length1+1, length2);
    });

    it('Check users existance', async ()=>{
        console.log("Valor de id: " + userId);
        user = await UserManager.getUserById(userId);
        assert.notEqual(user, null);
    })

    it('Check img_url existance', async () =>{
        assert.property(user, 'img_id');
    })

    it('Check message info: name', async ()=>{
        const nameFromDB = user.name;
        assert.equal(nameFromDB, data.name);
    });

    it('Check message info: password', async ()=>{
        const passwordFromDB = user.password;
        assert.equal(passwordFromDB, data.password);
    });

    it('Check message info: email', async ()=>{
        const emailFromDB = user.email;
        assert.equal(emailFromDB, data.email);
    });

    it('Check message info: phone', async ()=>{
        const phoneFromDB = user.phone;
        assert.equal(phoneFromDB, data.phone);
    });

    it('Check message info: img_url', async ()=>{
        const imgUrlFromDB = user.img_url;
        assert.equal(imgUrlFromDB, data.img_url);
    });

    it('Check message info: img_uuid', async ()=>{
        const imgUuidFromDB = user.img_uuid;
        assert.equal(imgUuidFromDB, data.img_uuid);
    });

    it('Delete user', async () =>{
        const length1 = await UserManager.getAmountOfUsers();
        await UserManager.deleteUserById(userId);
        const length2 = await UserManager.getAmountOfUsers();
        assert.equal(length1-1, length2);
    })
});