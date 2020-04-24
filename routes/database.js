const { Pool } = require('pg');
const express = require('express')
const router = express.Router();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

router.get('/', async (req, res) => {
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM users');
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

module.exports = router;