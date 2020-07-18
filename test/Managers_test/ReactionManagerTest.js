const assert = require('chai').assert;
const ReactionManager = require("../../Managers/Reactions/ReactionsManager")
const postReaction = require("../../Managers/Reactions/ReactionsIndex")

let reactionId = 0;
let reaction;

const user_id = 28;
const another_user_id = 23;
const video_id = 85;
const anotherVideoId = 83;

const data = {
    "author_id": user_id,
    "video_id": video_id,
    "positive_reaction": true
};

const data1 = {
    "author_id": another_user_id,
    "video_id": video_id,
    "positive_reaction": false
}

const data2 = {
    "author_id": another_user_id,
    "video_id": anotherVideoId,
    "positive_reaction": true
}


describe('Reactions test', async function () {
    this.timeout(30000);
    it('Add Reaction', async ()=>{
        const length1 = await ReactionManager.getAmountOfReactions();
        const error = await ReactionManager.validateInput(data).error;
        assert.isUndefined(error, 'Input valido');
        reactionId = await postReaction(data, null);
        const length2 = await ReactionManager.getAmountOfReactions();
        assert.equal(length1+1, length2, 'Agregar una reaccion sale bien');
    });

    it('Check Reactions existance', async () => {
        console.log("Valor de id: " + reactionId);
        reaction = await ReactionManager.getReactionById(reactionId);
        assert.isNotNull(reaction);
    })

    it('Check author_id existance', async () =>{
        assert.property(reaction, 'author_id');
    })

    it('Check video_id existance', async () =>{
        assert.property(reaction, 'video_id');
    })

    it('Check author_name existance', async () =>{
        assert.property(reaction, 'author_name');
    })

    it('Check reaction property existance', async () =>{
        assert.property(reaction, 'positive_reaction');
    })

    it('Check reaction is positive', async()=>{
        assert.isTrue(reaction.positive_reaction, 'Opinion positiva');
    })

    it('Update reaction', async()=>{
        await ReactionManager.updateReaction(reactionId, false);
        const actualReaction = await ReactionManager.getReactionById(reactionId);
        assert.isFalse(actualReaction.positive_reaction, 'Deberia ser falsa');
    })

    it('Post same reaction again', async()=>{
        let aux = data;
        aux.positive_reaction = false;
        const oldAmount = await ReactionManager.getAmountOfReactions();
        const actualId = await postReaction(data, null);
        assert.equal(actualId, reactionId, 'The ids should be the same')
        const newAmount = await ReactionManager.getAmountOfReactions();
        assert.equal(oldAmount, newAmount, 'Amount shouldnt have changed');
        const auxReaction = await ReactionManager.getReactionById(reactionId);
        assert.isFalse(auxReaction.positive_reaction, 'Now the reaction should have changed');
    })

    it('Delete reaction', async () =>{
        const length1 = await ReactionManager.getAmountOfReactions();
        await ReactionManager.deleteReactionById(reactionId);
        const length2 = await ReactionManager.getAmountOfReactions();
        assert.equal(length1-1, length2, 'Deleting reaction by id');
    })

    it('Deleting all reaction from a given video', async()=>{
        const oldAmount = await ReactionManager.getAmountOfReactions();
        const id1 = await postReaction(data, null);
        const id2 = await postReaction(data1, null);
        const newAmount = await ReactionManager.getAmountOfReactions();
        assert.equal(oldAmount+2, newAmount, 'Adding 2 reactions to video');
        await ReactionManager.deleteAllReactionsFromVideo(video_id);
        const amountAfterDelete = await ReactionManager.getAmountOfReactions();
        assert.equal(amountAfterDelete, oldAmount, 'After deleting both reactions from video');
    })

    it('Deleting all reaction from a given user', async() => {
        const oldAmount = await ReactionManager.getAmountOfReactions();
        const id1 = await postReaction(data1, null);
        const id2 = await postReaction(data2, null);
        const newAmount = await ReactionManager.getAmountOfReactions();
        assert.equal(oldAmount+2, newAmount, 'Adding 2 reactions to video');
        await ReactionManager.deleteAllReactionsFromUser(another_user_id);
        const amountAfterDelete = await ReactionManager.getAmountOfReactions();
        assert.equal(amountAfterDelete, oldAmount, 'After deleting both reactions from user');
    })
});