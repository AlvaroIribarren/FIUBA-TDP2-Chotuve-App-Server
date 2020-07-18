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


class Manager {
//pre: table exists
//post: returns max id from table.
    async getMaxId(table) {
        const text = 'select max(id) from ' + table;
        const res = await this.executeQueryInTableWithoutValues(text);
        const id = res.rows[0].max;
        return parseInt(id);
    }

//pre: table exists
//post: generates a new id from maxIdInTable +1
    async generateNewIdInTable(table) {
        const rows = await this.getRows(table);
        const hasElements = rows.length > 0;
        if (hasElements) {
            return await this.getMaxId(table) + 1;
        } else {
            return 1;
        }
    }

//pre: table exists
//post: get all rows from table as an array.
    async getRows(table) {
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
    async getIdFromTable(id, table) {
        return await this.getValueFromRow(id, "id", table);
    }

//pre: table exists
//post: gets elementif the condition is true. This condition is given by row = value
    async getValueFromRow(value, rowName, table) {
        const condition = rowName + " = " + value;
        const response = await this.operateAllRowsWithCondition(SELECT_STRING, table, condition);
        return response.rows[0];
    }

//pre: table exists and operation is valid.
//post: does the operation with a given condition.
    async operateAllRowsWithCondition(operation, table, condition) {
        const text = operation + " from " + table + " where " + condition;
        return await this.executeQueryInTableWithoutValues(text);
    }

//pre: table exists
//post: returns an array of elements where the condition is true.
    async getAllRowsWithCondition(table, condition) {
        const response = await this.operateAllRowsWithCondition(SELECT_STRING, table, condition);
        return response.rows;
    }

//pre: table exists
//post: deletes all rows where condition is true in table.
    async deleteAllRowsWithCondition(table, condition) {
        const response = await this.operateAllRowsWithCondition('delete', table, condition);
        return response.rows;
    }


//pre: table exists
//post: deletes a row by its id in the table.
    async deleteRowFromTableById(id, table) {
        try {
            const condition = ' id = ' + id;
            console.log("Deleting row from table: " + table);
            return await this.deleteAllRowsWithCondition(table, condition);
        } catch (e) {
            console.log(e);
        }
    }


//pre: text and values form a valid query.
//post: return query's response to operation.
    async executeQueryInTable(text, values) {
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
    async executeQueryInTableWithoutValues(text) {
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
    async updateRowWithNewValue(id, table, column_name, newValue) {
        const operation = 'UPDATE ' + table + ' SET ';
        const expression = column_name + ' = ' + newValue;
        const condition = ' WHERE id = ' + id;
        const text = operation + expression + condition;
        return await this.executeQueryInTableWithoutValues(text);
    }

    async turnColumnValueToTrueById(id, table, column_name){
        return await this.updateRowWithNewValue(id, table, column_name, true);
    }

    async turnColumnValueToFalseById(id, table, column_name){
        return await this.updateRowWithNewValue(id, table, column_name, false);
    }



//pre: table exists and has a column named: column_name
//post: updates column_name with the value+1.
    async incrementRowValueById(id, table, column_name) {
        const condition = ' id = ' + id;
        return await this.incrementRowValueByCondition(table, column_name, condition);
    }

    async incrementRowValueByCondition(table, column_name, condition) {
        const operation = 'UPDATE ' + table + ' SET ';
        const mathExpression = column_name + '=' + column_name + '+1 ';
        const text = operation + mathExpression + ' WHERE ' + condition;
        return await this.executeQueryInTableWithoutValues(text);
    }}

module.exports = new Manager();
