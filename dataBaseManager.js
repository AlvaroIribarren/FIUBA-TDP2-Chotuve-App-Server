const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

async function getUsers() {
    try {
        const books = await pool.query('select * from users');
        console.log(books.rows)
        return books.rows;
    } catch (e) {
        console.log(e);
    }
}

async function getUserById(id) {
    let users = await this.getUsers();
    return users.find(user => user.id === id);
}


async function insertUser(id, nameReceived, passwordReceived) {
    try {
        console.log("Intentando insertar user");
        const text = 'INSERT INTO users(id, username, password) VALUES($1, $2, $3)';
        const values = [id, nameReceived, passwordReceived];
        const result = await pool.query(text, values);
        console.log(result);
        pool.end();
    } catch (e) {
        console.log(e);
    }
}

async function deleteUser(){
    try {
        const text = 'DELETE FROM users WHERE username = $1';
        const values = ['manuel']
        const res = await pool.query(text, values);
        console.log(res);
        pool.end();
    } catch (e) {
        console.log(e);
    }
}

async function editUser(){
    try {
        const text = 'UPDATE users SET username = $1 WHERE username = $2';
        const values = ['Jhon', 'Juan'];
        const res = await pool.query(text, values);
        console.log(res);
        pool.end();
    } catch (e) {
        console.log(e);
    }
}

const Manager = {}
Manager.getUsers = getUsers;
Manager.getUserById = getUserById;
Manager.insertUser = insertUser;

module.exports = Manager;


