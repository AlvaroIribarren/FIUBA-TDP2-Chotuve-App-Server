const assert = require('chai').assert;

const SearchManager = require("../../Managers/SearchManager")

let searchId = 0;
let search;

const word = "testing";


describe('Search manager test', async function () {
    this.timeout(30000);
    it('Add search', async ()=>{
        const length1 = await SearchManager.getAmountOfSearches();
        searchId = await SearchManager.addSearch(word);
        const length2 = await SearchManager.getAmountOfSearches();

        assert.equal(length1+1, length2);
    });

    it('Check search existance', async () => {
        console.log("Valor de id: " + searchId);
        search = await SearchManager.getSearchById(searchId);
        assert.isNotNull(search);
    })

    it('Check amount existance', async () =>{
        assert.property(search, 'amount');
    })

    it('Check word property existance', async () =>{
        assert.property(search, 'word');
    })

    it('Check same search adds one to amount', async() => {
        const amount1 = await search.amount;
        await SearchManager.addSearch(word);
        search = await SearchManager.getSearchById(searchId);
        const amount2 = await search.amount;
        assert.equal(amount1+1, amount2);
    })

    it('Delete search', async () =>{
        const length1 = await SearchManager.getAmountOfSearches();
        await SearchManager.deleteSearchById(searchId);
        const length2 = await SearchManager.getAmountOfSearches();
        assert.equal(length1-1, length2);
    })
});