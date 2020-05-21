const { Pool } = require('pg');
const express = require('express')
const router = express.Router();
const Manager = require("./DBManager")


router.get('/', async (req, res) => {
    try {
        const result = await Manager.getUsers();
        const results = { 'results': (result) ? result.rows : null};
        res.send(results);
    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
})

module.exports = router;