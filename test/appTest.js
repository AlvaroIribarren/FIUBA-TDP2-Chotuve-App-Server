const assert = require('chai').assert;
const app = require('/index')
const Manager = require('databases/DBManager')

describe('App', ()=> {
   it('Concatenate string', ()=>{
       const validatedText = 'UPDATE videos SET likes = likes +1 WHERE id = id;'
       Manager.incrementRowValueById(1, 'videos', 'likes');
       assert.equal('')
   });
});