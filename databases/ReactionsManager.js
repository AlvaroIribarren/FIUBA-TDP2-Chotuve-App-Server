const Manager = require('./DBManager')
const UserManager = require('./UsersManager')
const VideoManager = require('./VideosManager')
const Joi = require('joi')

const reactions = 'reactions'

async function getAllReactions(){
    try {
        const result = Manager.getRows(reactions);
        return result;
    } catch(e){
        console.log(e);
    }
}

async function getReactionById(id){
    return await Manager.getIdFromTable(id, reactions);
}

async function getAllReactionsFromVideo(video_id){
    const text = 'SELECT * FROM reactions WHERE video_id = ' + video_id;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows);
    return res.rows;
}

async function insertReaction(author_id, author_name, video_id, positive_reaction) {
    const id = await Manager.generateNewIdInTable(reactions);
    const text = 'INSERT INTO reactions(id, author_id, author_name, video_id, positive_reaction) ' +
        'VALUES($1, $2, $3, $4, $5)';
    const values = [id, author_id, author_name, video_id, positive_reaction];
    await Manager.executeQueryInTable(text, values);
    return id;
}

async function deleteReactionById(id) {
    console.log("Deleting video");
    const text = 'DELETE FROM reactions WHERE id = ' + id;
    await Manager.executeQueryInTableWithoutValues(text);
}

async function deleteAllReactionsFromVideo(video_id){
    console.log("Deleting all reactions");
    const text = 'DELETE FROM friends WHERE video_id = ' + video_id;
    await Manager.executeQueryInTableWithoutValues(text);
}

async function checkIfUserIsTryingToPostTheSameReaction(author_id, video_id, positive_reaction) {
    const str1 = 'SELECT * FROM ' + reactions + ' WHERE';
    const str2 = ' author_id =' + author_id + ' AND video_id =' + video_id +
        ' AND positive_reaction =' + positive_reaction;
    const text = str1 + str2;
    const equalReaction = await Manager.executeQueryInTableWithoutValues(text);
    return equalReaction.rows.length > 0;
}

async function validateUserInfo(author_id, author_name){
    return await UserManager.checkCorrectIdAndName(author_id, author_name);
}

async function validateVideosExistance(video_id){
    return await VideoManager.getVideoById(video_id);
}

async function postReaction(data, res){
    const author_id = data.author_id;
    const author_name = data.author_name;
    const video_id = data.video_id;
    const positive_reaction = data.positive_reaction;

    const rightUserInfo = await validateUserInfo(author_id, author_name);
    const rightVideoInfo = await validateVideosExistance(video_id);

    if (rightUserInfo && rightVideoInfo){
        const sameReactionTwice = await checkIfUserIsTryingToPostTheSameReaction
                            (author_id, video_id, positive_reaction);
        if (!sameReactionTwice){
            await VideoManager.addReactionToVideo(video_id, positive_reaction);
            const id = await insertReaction(author_id, author_name, video_id, positive_reaction);

            res.send({id, author_id, author_name, video_id, positive_reaction});
        } else {
            res.send("This user has already posted this reaction in this video.");
        }
    } else {
        res.status(404).send("User or videos information is incorrect or doesn't exist.");
    }
}

async function validateInput(body){
    const schema = {
        author_id: Joi.number().positive().required(),
        author_name: Joi.string().required(),
        video_id: Joi.number().positive().required(),
        positive_reaction: Joi.boolean().required(),
    }
    return Joi.validate(body, schema);
}

const ReactionsManager = {}
ReactionsManager.getAllReactions = getAllReactions;
ReactionsManager.getReactionById = getReactionById;
ReactionsManager.getAllReactionsFromVideo = getAllReactionsFromVideo;
ReactionsManager.insertReaction = insertReaction;
ReactionsManager.deleteReactionById = deleteReactionById;
ReactionsManager.deleteAllReactionsFromVideo = deleteAllReactionsFromVideo;
ReactionsManager.checkIfUserIsTryingToPostTheSameReaction = checkIfUserIsTryingToPostTheSameReaction;
ReactionsManager.postReaction = postReaction;
ReactionsManager.validateInput = validateInput;

module.exports = ReactionsManager;