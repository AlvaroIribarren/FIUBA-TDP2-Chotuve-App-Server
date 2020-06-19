const Manager = require('./DBManager')

const searches = 'searches';

async function insertSearch(word){
    const id = await Manager.generateNewIdInTable(searches);
    const text = 'INSERT INTO searches (id, word) VALUES ($1, $2)';
    const values = [id, word];
    const result = await Manager.executeQueryInTable(text, values);
    return result;
}

async function addOneToAmount(search){
    search = "'" + search + "'";
    const condition = ' word = ' + search;
    return await Manager.incrementRowValueByCondition(searches, ' amount ', condition);
}


class SearchManager {
    async doesSearchExist(search){
        const allSearches = await Manager.getRows(searches);
        for (let actualSearch of allSearches) {
            if (actualSearch.word === search)
                return true;
        }
        return false;
    }

    //if it already exists, adds 1. If not it creates it.
    async addSearch(search){
        search = search.replace(/'/g,'');
        search = search.toLowerCase();
        const searchAlreadyExists = await this.doesSearchExist(search);
        if (searchAlreadyExists){
            return await addOneToAmount(search);
        } else {
            return await insertSearch(search);
        }
    }

    async getSearches(){
        return await Manager.getRows(searches);
    }
}

module.exports = new SearchManager();