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
        res.send(results);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
})

module.exports = router;
