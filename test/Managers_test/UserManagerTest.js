const assert = require('chai').assert;
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

const profile_picture = {
    "img_url": 'new_one',
    "img_uuid": 'new_uuid'
}


describe('Users test', async function () {
    this.timeout(30000);
    it('Add User', async ()=>{
        const length1 = await UserManager.getAmountOfUsers();
        const error = await UserManager.validateUser(data).error;
        assert.isUndefined(error, 'Checking the data is valid');
        userId = await UserManager.postUser(data, null);
        const length2 = await UserManager.getAmountOfUsers();
        assert.equal(length1+1, length2);
    });

    it('Check users existance', async ()=>{
        console.log("Valor de id: " + userId);
        user = await UserManager.getUserById(userId);
        assert.isNotNull(user);
    })

    it('Check users existance by other method', async()=>{
        const exists = await UserManager.doesUserExist(userId);
        assert.isNotNull(exists)
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

    it('Get user by email', async ()=>{
        const email = data.email;
        const userByEmail = await UserManager.getUserByEmail(email);
        assert.equal(user.id, userByEmail.id, 'The users ids should be the same');
    })

    it('Get active users', async()=>{
        const allActiveUsers = await UserManager.getActiveUsers();
        const createdUser = allActiveUsers.find(actualUser => actualUser.id === userId);
        assert.exists(createdUser, 'User recently created does exist and is active');
    })

    it('Check user is enabled', async()=> {
        const enabled = await UserManager.isUserEnabled(userId);
        assert.isTrue(enabled, 'User is initially enabled');
    })

    it('Disable user', async()=>{
        await UserManager.disableUser(userId);
        const enabled = await UserManager.isUserEnabled(userId);
        assert.isFalse(enabled, 'User has benn disabled');
    })

    it('Enabling again', async()=>{
        await UserManager.enableUser(userId);
        const enabled = await UserManager.isUserEnabled(userId);
        assert.isTrue(enabled, 'User enabled again');
    })

    it('New profile picture is valid', async()=>{
        const error = await UserManager.validateImageModification(profile_picture).error;
        assert.isUndefined(error, 'Error should be undefined');
    })

    it('Change profile picture', async()=>{
        const img_id = user.img_id;
        await UserManager.changeProfilePicture(userId, img_id, profile_picture.img_url, profile_picture.img_uuid);
        const auxUser = await UserManager.getUserById(userId);
        assert.equal(auxUser.img_url, profile_picture.img_url, 'The urls should be the same');
        assert.equal(auxUser.img_uuid, profile_picture.img_uuid, 'The uuids should be the same');
    })

    it('Delete user', async () =>{
        const length1 = await UserManager.getAmountOfUsers();
        await UserManager.deleteUserById(userId);
        const length2 = await UserManager.getAmountOfUsers();
        assert.equal(length1-1, length2);
    })

    it('Get all users', async()=>{
        const allUsers = await UserManager.getUsers();
        const amountOfUsers = await UserManager.getAmountOfUsers();
        assert.equal(allUsers.length, amountOfUsers, 'Lengths should be the same');
    })
});