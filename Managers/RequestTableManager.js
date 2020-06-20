const Manager = require("./DBManager")

const http_requests = 'http_requests';

async function insertValues(method, url, status, res_length, res_time){
    const id = await Manager.generateNewIdInTable(http_requests);
    const text = 'INSERT INTO http_requests(id, method, url, status, res_length, res_time) ' +
        'VALUES($1, $2, $3, $4, $5, $6)';
    const values = [id, method, url, status, res_length, res_time];
    const result = await Manager.executeQueryInTable(text, values);
    return result;
}

class RequestTableManager{
    async insertRequest(req, res, tokens) {
        const method = tokens.method(req, res);
        const url = tokens.url(req, res);
        const status = tokens.status(req, res);
        const res_length = tokens.res(req, res, 'content-length');
        const res_time = tokens['response-time'](req, res);
        if (res_length > 0) {
            return await insertValues(method, url, status, res_length, res_time);
        } else {
            return null;
        }
    }
    async getRequests(){
        return await Manager.getRows(http_requests);
    }
}

module.exports = new RequestTableManager();