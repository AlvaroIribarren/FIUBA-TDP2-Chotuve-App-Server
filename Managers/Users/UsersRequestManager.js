const RequestManager = require("../ExternalManagers/RequestsManager")
const USERS_URL = "https://chotuve-auth-server-g5-dev.herokuapp.com/users"

async function getAllUsersFromAuthServer(){
    const response =  await RequestManager.getResponseByLink(USERS_URL);
    return response.data;
}

async function getUserFromAuthById(id) {
    const str = "/" + id;
    const link = USERS_URL + str;
    const res = await RequestManager.getResponseByLink(link);
    if (res) {
        return await res.data;
    } else {
        return null;
    }
}

async function getElementByIdFromArray(array, id){
    return array.find(element => element.id === id);
}

async function getElementByEmailFromArray(array, email){
    return array.find(element => element.email === email);
}

async function getUserByEmail(email){
    const result = await RequestManager.getResponseWithBody(USERS_URL, {data: {user_email: email}});

    if (result) {
        return result;
    } else {
        return null;
    }
}

async function addDataToUser(userToModify, image) {
    const id = userToModify.id;
    const userFromAuth = await getUserFromAuthById(id);
    //No me importa si no se encontro la imagen porque puede que el usuario no tenga foto.
    if (userToModify) {
        userToModify.name = userFromAuth.display_name;
        userToModify.email = userFromAuth.email;
        userToModify.phone = userFromAuth.phone_number;
        userToModify.sign_in_method = userFromAuth.sign_in_method;
        userToModify.img_url = image.url;
        userToModify.img_uuid = image.uuid;
        return userToModify
    } else {
        return null;
    }
}

async function addDataToUsers(usersFromAppServer, images){
    const usersToReturn = [];
    for (let userFromAppServer of usersFromAppServer){
        const image = await getElementByIdFromArray(images, userFromAppServer.img_id);
        usersFromAppServer = await addDataToUser(userFromAppServer, image);
        if (userFromAppServer){
            usersToReturn.push(userFromAppServer);
        }
    }
    return usersToReturn;
}

async function postUserToAuth(user){
    return await RequestManager.generatePost(USERS_URL, user);
}

async function deleteUserFromAuth(id){
    return await RequestManager.deleteById(USERS_URL, id);
}

const UsersRequestManager = {}
UsersRequestManager.addDataToUser = addDataToUser;
UsersRequestManager.addDataToUsers = addDataToUsers;
UsersRequestManager.getUserByEmail = getUserByEmail;
UsersRequestManager.getUserById = getUserFromAuthById;
UsersRequestManager.getAllUsersFromAuthServer = getAllUsersFromAuthServer;
UsersRequestManager.postUserToAuth = postUserToAuth;
UsersRequestManager.deleteUserFromAuth = deleteUserFromAuth;

module.exports = UsersRequestManager;