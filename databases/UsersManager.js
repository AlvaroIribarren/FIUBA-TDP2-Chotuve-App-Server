const Manager = require('./DBManager')

const users = 'users';

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

async function insertUser(id, name, password, email, phone, img_url, img_uuid) {
    console.log("Insertando elemento en: " + users);
    const text = 'INSERT INTO users(id, name, password, email, phone, img_url, img_uuid) VALUES($1, $2, $3, $4, $5, $6, $7)';
    const values = [id, name, password, email, phone, img_url, img_uuid];
    await Manager.executeQueryInTable(text, values);
}

async function deleteUserById(id) {
    await Manager.deleteRowFromTable(id, users);
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

async function generateNewId(){
    return await Manager.generateNewIdInTable(users);
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

const UsersManager = {}
UsersManager.insertUser = insertUser;
UsersManager.getUsers = getUsers;
UsersManager.getUserById = getUserById;
UsersManager.deleteUserById = deleteUserById;
UsersManager.editUser = editUser;
UsersManager.generateNewId = generateNewId;
UsersManager.checkCorrectIdAndName = checkCorrectIdAndName;
UsersManager.getUserByNameAndPassword = getUserByEmailAndPassword;
UsersManager.getUserByEmail = getUserByEmail;
module.exports = UsersManager;