const Manager = require('../DBManager')
const UsersRequestManager = require("./UsersRequestManager")
const MediaRequestManager = require("../Videos/MediaRequestManager")
const Joi = require('joi')

const users = 'users';
const minNameLength = 3;
const minPassLength = 5;

async function getUsers(){
    const usersFromAppServer = await Manager.getRows(users);
    const imagesFromMediaServer = await MediaRequestManager.getAllImagesFromMedia();
    if (usersFromAppServer){
        return await UsersRequestManager.addDataToUsers(usersFromAppServer, imagesFromMediaServer);
    } else {
        return null;
    }
}

async function getUserById(id){
    const userFromAppSv = await Manager.getIdFromTable(id, users);
    const image = await MediaRequestManager.getImageById(userFromAppSv.img_id);
    return await UsersRequestManager.addDataToUser(userFromAppSv, image);
}

async function getUserByEmail(email){
    return await UsersRequestManager.getUserByEmail(email);
}

async function insertUser(id, img_id) {
    console.log("Insertando elemento en: " + users);
    const text = 'INSERT INTO users(id, img_id) VALUES($1, $2)';
    const values = [id, img_id];
    await Manager.executeQueryInTable(text, values);
}

//todo: mandar firebase_token a Auth
async function postUser(data, res){
    const name = data.name;
    const password = "soy_terrible_rancio";
    const email = data.email;
    const phone = data.phone;
    const sign_in_method = data.sign_in_method;
    const img_url = data.img_url;
    const img_uuid = data.img_uuid;
    const resultFromMedia = await MediaRequestManager.postImageToMedia({url: img_url, uuid: img_uuid});
    const img_id = resultFromMedia.id;
    const firebase_token = data.firebase_token;
    const userToAuth = {display_name: name, password, email, phone_number: phone, sign_in_method};
    const resultFromAuth = await UsersRequestManager.postUserToAuth(userToAuth);
    const id = resultFromAuth.id;
    const refresh_token = resultFromAuth.refresh_token;
    const sl_token = resultFromAuth.token;
    await insertUser(id, img_id);
    //testing purposes.
    if (res !== null) {
        console.log({refresh_token, sl_token});
        res.status(201).send({id, refresh_token, sl_token,});
    }
    return id;
}

async function deleteUserById(id) {
    const user = await getUserById(id);
    if (user){
        await Manager.deleteRowFromTable(id, users);
        return await UsersRequestManager.deleteUserFromAuth(id);
    } else {
        return null;
    }
}

//todo: put a auth
async function editUser(){
    try {
    } catch (e) {
        console.log(e);
    }
}

async function getNameById(user_id){
    const user = await getUserById(user_id);
    return user.name;
}

async function changeProfilePicture(user_id, newImgUrl, newImgUuid){
    const user = await getUserById(user_id);
    const img_id = user.img_id;
    return await MediaRequestManager.changeProfileImage(img_id, newImgUrl, newImgUuid);
}

async function checkCorrectIdAndName(author_id, author_name){
    const user = await getUserById(author_id);
    if (user){
        const name = user.name;
        return author_name === name;
    } else {
        return false;
    }
}

function validateUser(body){
    const schema = {
        name: Joi.string().min(minNameLength).required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        sign_in_method: Joi.string().required(),
        img_url: Joi.string().required(),
        img_uuid: Joi.string().required(),
        firebase_token: Joi.string().required()
    }
    return Joi.validate(body, schema);
}

async function validateImageModification(body){
    const schema = {
        img_url: Joi.string().required(),
        img_uuid: Joi.string().required()
    }
    return Joi.validate(body, schema);
}

async function validateProfileModification(body){
    const schema = {
        name: Joi.string().min(minNameLength),
        email: Joi.string(),
        phone: Joi.string(),
        sign_in_method: Joi.string(),
        firebase_token: Joi.string()
    }
    return Joi.validate(body, schema);
}

const UsersManager = {}
UsersManager.postUser = postUser;
UsersManager.getUsers = getUsers;
UsersManager.getUserById = getUserById;
UsersManager.getNameById = getNameById;
UsersManager.deleteUserById = deleteUserById;
UsersManager.editUser = editUser;
UsersManager.checkCorrectIdAndName = checkCorrectIdAndName;
UsersManager.getUserByEmail = getUserByEmail;
UsersManager.validateUser = validateUser;
UsersManager.validateImageModification = validateImageModification;
UsersManager.validateProfileModification = validateProfileModification;
UsersManager.changeProfilePicture = changeProfilePicture;
module.exports = UsersManager;