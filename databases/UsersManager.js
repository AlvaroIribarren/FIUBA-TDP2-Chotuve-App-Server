const Manager = require('./DBManager')

const table = 'users';

async function getUsers(){
    return await Manager.getRows(table);
}

async function getUserById(id){
    return await Manager.getIdFromTable(id, table);
}

async function insertUser(userid, name, password, email, phone, profileimgurl) {
    console.log("Insertando elemento en: " + table);
    const text = 'INSERT INTO users(userid, name, password, email, phone, profileimgurl) VALUES($1, $2, $3, $4, $5, $6)';
    const values = [userid, name, password, email, phone, profileimgurl];
    await Manager.executeQueryInTable(text, values);
}

async function deleteUserById(id) {
    await Manager.deleteRowFromTable(id, table);
}

async function editUser(fieldToBeChanged, field1, fieldToCompare, condition){
    try {
        //const text = 'UPDATE users SET $1 = $2 WHERE $3 = $4';
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
    return await Manager.generateNewIdInTable(table);
}

const UsersManager = {}
UsersManager.insertUser = insertUser;
UsersManager.getUsers = getUsers;
UsersManager.getUserById = getUserById;
UsersManager.deleteUserById = deleteUserById;
UsersManager.editUser = editUser;
UsersManager.generateNewId = generateNewId;
module.exports = UsersManager;