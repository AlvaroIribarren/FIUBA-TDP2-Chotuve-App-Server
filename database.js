const { Pool } = require('pg');
const express = require('express')
const router = express.Router();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

router.get('/db', async (req, res) => {
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM test_table');
        const results = { 'results': (result) ? result.rows : null};
        res.render('pages/db', results );
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})

const getUsers = async () => {
    try {
        const books = await pool.query('select * from users');
        console.log(books.rows)
        return books.rows;
    } catch(e){
        console.log(e);
    }
}
asdasd
async function getUserById (id)  {
    let users = await getUsers();
    return users.find(user => user.id === id);
}


async function insertUser(nameReceived, passwordReceived) {
    try {
        const text = 'INSERT INTO users(username, password) VALUES($1, $2)';
        const values = [nameReceived, passwordReceived];
        const result = await pool.query(text, values);
        console.log(result);
        pool.end();
    } catch (e){
        console.log(e);
    }
}

const deleteUser = async () => {
    try {
        const text = 'DELETE FROM users WHERE username = $1';
        const values = ['manuel']
        const res = await pool.query(text, values);
        console.log(res);
        pool.end();
    } catch (e){
        console.log(e);
    }
}

const editUser = async () => {
    try {
        const text = 'UPDATE users SET username = $1 WHERE username = $2';
        const values = ['Jhon', 'Juan'];
        const res = await pool.query(text, values);
        console.log(res);
        pool.end();
    } catch (e){
        console.log(e);
    }
}

async function print(){
    const res = await getUserById('Foundation');
    console.log("Buscaste el libro con titulo: " + res.title + " su autor es: " + res.author);
}

module.exports = {
    getUser : getUserById,
    insertUser : insertUser
};