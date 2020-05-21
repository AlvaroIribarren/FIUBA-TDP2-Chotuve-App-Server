const assert = require('chai').assert;

const Manager = require("../../Managers/DBManager")
const UserManager = require("../../Managers/Users/UsersManager")

let userId = 0;
let userFromDB;
const data = {
     "name" : 'Alvaro',
     "password" : 'asdasd',
     "email" : 'alvarito@alvarito.com',
     "phone" : '1234567890',
     "img_url" : 'asdasd',
     "img_uuid" : 'asdasd'
};



describe('Users test', async ()=> {
    it('Add User', async ()=>{
        const users = await UserManager.getUsers();
        const amount = users.length;
        userId = await UserManager.postUser(data, null);
        const messages2 = await UserManager.getUsers();
        const amount2 = messages2.length;

        assert.equal(amount+1, amount2);
        return userId;
    });

    it('Check users existance', async ()=>{
        userFromDB = await UserManager.getUserById(userId);
        assert.notEqual(userFromDB, null);
    })

    it('Check name existance', async() =>{
        assert.property(userFromDB, 'name');
    })

    it('Check password existance', async () =>{
        assert.property(userFromDB, 'password');
    })

    it('Check email property existance', async () =>{
        assert.property(userFromDB, 'email');
    })

    it('Check phone existance', async () =>{
        assert.property(userFromDB, 'phone');
    })

    it('Check img_url existance', async () =>{
        assert.property(userFromDB, 'img_url');
    })

    it('Check img_uuid existance', async () =>{
        assert.property(userFromDB, 'img_uuid');
    })

    it('Check message info: name', async ()=>{
        const nameFromDB = userFromDB.name;
        assert.equal(nameFromDB, data.name);
    });

    it('Check message info: password', async ()=>{
        const passwordFromDB = userFromDB.password;
        assert.equal(passwordFromDB, data.password);
    });

    it('Check message info: email', async ()=>{
        const emailFromDB = userFromDB.email;
        assert.equal(emailFromDB, data.email);
    });

    it('Check message info: phone', async ()=>{
        const phoneFromDB = userFromDB.phone;
        assert.equal(phoneFromDB, data.phone);
    });

    it('Check message info: img_url', async ()=>{
        const imgUrlFromDB = userFromDB.img_url;
        assert.equal(imgUrlFromDB, data.img_url);
    });

    it('Check message info: img_uuid', async ()=>{
        const imgUuidFromDB = userFromDB.img_uuid;
        assert.equal(imgUuidFromDB, data.img_uuid);
    });

    it('Delete message', async () =>{
        const messages = await UserManager.getUsers();
        const amount = messages.length;
        await UserManager.deleteUserById(userId);
        const newMessages = await UserManager.getUsers();
        const newAmount = newMessages.length;
        assert.equal(amount-1, newAmount);
    })
});