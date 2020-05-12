const Manager = require('./DBManager')
const UrlManager = require("./Videos/URLSManager")
const Joi = require('joi')

const users = 'users';
const minNameLength = 3;
const minPassLength = 5;

async function getUsers(){
    return await Manager.getRows(users);
}

async function getUserById(id){
    return await Manager.getIdFromTable(id, users);
}

async function getUserByEmail(email){
    const mail = "'" + email + "'";

    const condition = " email = " + mail;
    const usersRows = await Manager.getAllRowsWithCondition(users, condition);
    return usersRows[0];
}

async function getUserByEmailAndPassword(email, password){
    const mail = "'" + email + "'";
    const pass = "'" + password + "'";

    const condition = " email = " + mail + " AND" + " password = " + pass;
    const usersRows = await Manager.getAllRowsWithCondition(users, condition);
    return usersRows[0];
}

async function insertUser(id, name, password, email, phone, img_id, img_url, img_uuid) {
    console.log("Insertando elemento en: " + users);
    const text = 'INSERT INTO users(id, name, password, email, phone, img_id, img_url, img_uuid) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [id, name, password, email, phone, img_id, img_url, img_uuid];
    await Manager.executeQueryInTable(text, values);
}

async function postUser(data, res){
    const id = await generateNewId();
    const name = data.name;
    const password = data.password;
    const email = data.email;
    const phone = data.phone;
    const img_url = data.img_url;
    const img_uuid = data.img_uuid;
    const img_id = await UrlManager.postImageToMedia({url: img_url, uuid: img_uuid});
    await insertUser(id, name, password, email, phone, img_id, img_url, img_uuid);
    //testing purposes.
    if (res !== null) {
        res.status(201).send({id, name, password, email, phone, img_id, img_url, img_uuid});
    }
    return id;
}

async function deleteUserById(id) {
    const user = await getUserById(id);
    if (user){
        return await Manager.deleteRowFromTable(id, users);
    } else {
        return null;
    }

}

async function editUser(fieldToBeChanged, field1, fieldToCompare, condition){
    try {
        const str = 'UPDATE users SET '
        const modifiedString = "'" + field1 + "'";
        const str1 = fieldToBeChanged + ' = ' + modifiedString + ' WHERE ' + fieldToCompare + ' = ' + condition;
        const text = str + str1;
        console.log("Final text: " + text);
        await Manager.executeQueryInTable(text);
    } catch (e) {
        console.log(e);
    }
}

async function getNameById(user_id){
    const user = await getUserById(user_id);
    return user.name;
}

async function generateNewId(){
    return await Manager.generateNewIdInTable(users);
}

async function changeProfilePicture(id, newImgUrl){
    await Manager.updateRowWithNewValue(id, users, "'img_url'", newImgUrl);
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
        password: Joi.string().min(minPassLength).required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        img_url: Joi.string().required(),
        img_uuid: Joi.string().required()
    }
    return Joi.validate(body, schema);
}

function validateUserWithOptionalFields(body){
    const schema = {
        name: Joi.string().min(minNameLength),
        password: Joi.string().min(minPassLength),
        email: Joi.string(),
        phone: Joi.string(),
        img_url: Joi.string(),
        img_uuid: Joi.string()
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
UsersManager.generateNewId = generateNewId;
UsersManager.checkCorrectIdAndName = checkCorrectIdAndName;
UsersManager.getUserByNameAndPassword = getUserByEmailAndPassword;
UsersManager.getUserByEmail = getUserByEmail;
UsersManager.validateUser = validateUser;
UsersManager.validateUserWithOptionalFields = validateUserWithOptionalFields;
module.exports = UsersManager;