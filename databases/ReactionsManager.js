const Manager = require('./DBManager')
const UserManager = require('./UsersManager')
const VideoManager = require('./Videos/VideosManager')
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
    const condition = ' video_id = ' + video_id;
    return await Manager.deleteAllRowsWithCondition(reactions, condition);
}

async function getReactionFromUserInVideo(author_id, video_id) {
    const condition = ' author_id =' + author_id + ' AND video_id =' + video_id;
    const filteredReactions = await Manager.getAllRowsWithCondition(reactions, condition);
    if (filteredReactions.length > 0)
        return filteredReactions[0];
    else
        return null;
}

async function validateUserInfo(author_id, author_name){
    return await UserManager.checkCorrectIdAndName(author_id, author_name);
}

async function validateVideosExistance(video_id){
    return await VideoManager.getVideoById(video_id);
}

async function updateReaction(id, positive_reaction){
    return await Manager.updateRowWithNewValue(id, reactions, 'positive_reaction', positive_reaction);
}

async function postReaction(data, res){
    const author_id = data.author_id;
    const author_name = data.author_name;
    const video_id = data.video_id;
    const positive_reaction = data.positive_reaction;

    const rightUserInfo = await validateUserInfo(author_id, author_name);
    const rightVideoInfo = await validateVideosExistance(video_id);

    if (rightUserInfo && rightVideoInfo){
        const reaction = await getReactionFromUserInVideo(author_id, video_id, positive_reaction);

        if (!reaction) {
            await VideoManager.addReactionToVideo(video_id, positive_reaction);
            const id = await insertReaction(author_id, author_name, video_id, positive_reaction);
            res.send({id, author_id, author_name, video_id, positive_reaction});
        } else {
            if (reaction.positive_reaction === positive_reaction){
                res.send("Intentado subir la misma reaccion otra vez");
            } else {
                await updateReaction(reaction.id, positive_reaction);
                const reactionToBeDeleted = !(positive_reaction);
                await VideoManager.deleteReactionFromVideo(video_id, reactionToBeDeleted);
                await VideoManager.addReactionToVideo(video_id, positive_reaction);
                const id = reaction.id;
                res.send({id, author_id, author_name, video_id, positive_reaction});
            }
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
ReactionsManager.getReactionFromUserInVideo = getReactionFromUserInVideo;
ReactionsManager.postReaction = postReaction;
ReactionsManager.validateInput = validateInput;

module.exports = ReactionsManager;