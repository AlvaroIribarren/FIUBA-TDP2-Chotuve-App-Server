const {Pool} = require('pg');

const SELECT_STRING = 'select *';

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

//pre: table exists
//post: returns max id from table.
async function getMaxId(table){
    const text = 'select max(id) from ' + table;
    const res = await executeQueryInTableWithoutValues(text);
    const id = res.rows[0].max;
    return parseInt(id);
}

//pre: table exists
//post: generates a new id from maxIdInTable +1
async function generateNewIdInTable(table){
    const rows = await getRows(table);
    const hasElements = rows.length > 0;
    if (hasElements) {
        return await getMaxId(table) + 1;
    } else {
        return 1;
    }
}

//pre: table exists
//post: get all rows from table as an array.
async function getRows(table) {
    try {
        const str = 'select * from ' + table;
        const tableElements = await pool.query(str);
        return tableElements.rows;
    } catch (e) {
        console.log(e);
    }
}

//pre: table exists
//post: returns element if exists or null if it doesn't
async function getIdFromTable(id, table) {
    return await getValueFromRow(id, "id", table);
}

//pre: table exists
//post: gets elementif the condition is true. This condition is given by row = value
async function getValueFromRow(value, rowName, table){
    const condition =  rowName + " = " + value;
    const response = await operateAllRowsWithCondition(SELECT_STRING, table, condition);
    return response.rows[0];
}

//pre: table exists and operation is valid.
//post: does the operation with a given condition.
async function operateAllRowsWithCondition(operation, table, condition){
    const text = operation + " from " + table + " where " + condition;
    const response = await executeQueryInTableWithoutValues(text);
    return response;
}

//pre: table exists
//post: returns an array of elements where the condition is true.
async function getAllRowsWithCondition(table, condition){
    const response = await operateAllRowsWithCondition(SELECT_STRING, table, condition);
    return response.rows;
}

//pre: table exists
//post: deletes all rows where condition is true in table.
async function deleteAllRowsWithCondition(table, condition){
    const response = await operateAllRowsWithCondition('delete', table, condition);
    return response.rows;
}


//pre: table exists
//post: deletes a row by its id in the table.
async function deleteRowFromTableById(id, table){
    try {
        const condition = ' id = ' + id;
        console.log("Deleting row from table: " +  table);
        return await deleteAllRowsWithCondition(table, condition);
    } catch (e) {
        console.log(e);
    }
}


//pre: text and values form a valid query.
//post: return query's response to operation.
async function executeQueryInTable(text, values){
    try {
        console.log("Query to execute: " + text);
        const res = await pool.query(text, values);
        console.log("Executing normal query with res: " + res);
    } catch (e) {
        console.log(e);
    }
}

//pre: text is a valid query.
//post: return query's response to operation.
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

//pre: table exists and has a column named: column_name
//post: updates column_name with new value where id is found.
async function updateRowWithNewValue(id, table, column_name, newValue){
    const operation = 'UPDATE ' + table + ' SET ';
    const expression = column_name + '=' + newValue;
    const condition = ' WHERE id = ' + id;
    const text = operation + expression + condition;
    await executeQueryInTableWithoutValues(text);
}

//pre: table exists and has a column named: column_name
//post: updates column_name with the value+1.
async function incrementRowValueById(id, table, column_name){
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
Manager.getValueFromRow = getValueFromRow;
Manager.getAllRowsWithCondition = getAllRowsWithCondition;
Manager.updateRowWithNewValue = updateRowWithNewValue;
Manager.deleteAllRowsWithCondition = deleteAllRowsWithCondition;

module.exports = Manager;
