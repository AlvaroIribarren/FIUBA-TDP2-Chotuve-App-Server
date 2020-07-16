const Manager = require('./DBManager')

const searches = 'searches';

async function insertSearch(word){
    const id = await Manager.generateNewIdInTable(searches);
    const text = 'INSERT INTO searches (id, word) VALUES ($1, $2)';
    const values = [id, word];
    await Manager.executeQueryInTable(text, values);
    return id;
}

async function addOneToAmount(search){
    search = "'" + search + "'";
    const condition = ' word = ' + search;
    return await Manager.incrementRowValueByCondition(searches, ' amount ', condition);
}


class SearchManager {
    async getSearches(){
        return await Manager.getRows(searches);
    }

    async getAmountOfSearches(){
        const allSearches = await this.getSearches();
        return allSearches.length;
    }

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

    async getSearchById(id){
        return await Manager.getIdFromTable(id, searches);
    }

    async deleteSearchById(id){
        return await Manager.deleteRowFromTableById(id, searches);
    }
}

module.exports = new SearchManager();