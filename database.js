const { Client } = require('pg');

const connectionString = "postgres://xovbegcheqegut:13cd6d27773e4f49fbbc6fb4677a84d3b92f9c0093793238f468eab55e32186e@ec2-52-6-143-153.compute-1.amazonaws.com:5432/d6o8g7k6fm0qv1"
const client = new Client({
    connectionString: connectionString,
    ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        console.log(JSON.stringify(row));
    }
    client.end();
});


// const config = {
//     user: 'postgres',
//     host: 'ec2-52-6-143-153.compute-1.amazonaws.com',
//     password: 'pass',
//     database: 'library'
// };
//
// const pool = new Pool(config);

const getUsers = async () => {
    try {
        const books = await pool.query('select * from users');
        console.log(books.rows)
        return books.rows;
    } catch(e){
        console.log(e);
    }
}

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