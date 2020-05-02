const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// const config = {
//     user: 'postgres',
//     host: 'localhost',
//     password: 'alvaro123',
//     database: 'library'
// };
//
// const pool = new Pool(config);


async function getMaxId(table){
    const text = 'select max(id) from ' + table;
    const res = await executeQueryInTableWithoutValues(text);
    const id = res.rows[0].max;
    return parseInt(id);
}


async function generateNewIdInTable(table){
    const rows = await getRows(table);
    const hasElements = rows.length > 0;
    if (hasElements) {
        return await getMaxId(table) + 1;
    } else {
        return 1;
    }
}

async function getRows(table) {
    try {
        const str = 'select * from ' + table;
        const tableElements = await pool.query(str);
        return tableElements.rows;
    } catch (e) {
        console.log(e);
    }
}

async function getIdFromTable(id, table) {
    let rows = await this.getRows(table);
    const row = rows.find(row => row.id === id);
    return row;
}


async function deleteRowFromTableById(id, table){
    try {
        const text = 'DELETE FROM ' + table + ' WHERE id = ' + id;
        await executeQueryInTableWithoutValues(text);
        console.log("Deleting row from table: " +  table);
    } catch (e) {
        console.log(e);
    }
}

async function executeQueryInTable(text, values){
    try {
        console.log("Query to execute: " + text);
        const res = await pool.query(text, values);
        console.log("Executing normal query with res: " + res);
    } catch (e) {
        console.log(e);
    }
}

async function executeQueryInTableWithoutValues(text){
    try {
        console.log("Query to execute: " + text);
        const res = await pool.query(text);
        console.log("Executing normal query with res: " + res);
        return res;
    } catch (e) {
        console.log(e);
    }
}

async function incrementRowValueById(id, table, column_name){
    //UPDATE videos SET likes = likes +1 WHERE id = id;
    const operation = 'UPDATE ' + table + ' SET ';
    const mathExpression = column_name + '=' + column_name + '+1 ';
    const condition = 'WHERE id = ' + id;
    const text = operation + mathExpression + condition;
    await executeQueryInTableWithoutValues(text);
}

const Manager = {}
Manager.getRows = getRows;
Manager.getIdFromTable = getIdFromTable;
Manager.executeQueryInTable = executeQueryInTable;
Manager.executeQueryInTableWithoutValues = executeQueryInTableWithoutValues;
Manager.deleteRowFromTable = deleteRowFromTableById;
Manager.generateNewIdInTable = generateNewIdInTable;
Manager.incrementRowValueById = incrementRowValueById;

module.exports = Manager;
