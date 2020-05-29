const VideoManager = require('../Videos/VideosManager')
const ReactionsManager = require('../ReactionsManager')


async function validateVideosExistance(video_id){
    return await VideoManager.getVideoById(video_id);
}

async function postReaction(data, res){
    const author_id = data.author_id;
    const author_name = data.author_name;
    const video_id = data.video_id;
    const positive_reaction = data.positive_reaction;

    const rightUserInfo = await ReactionsManager.validateUserInfo(author_id, author_name);
    const rightVideoInfo = await validateVideosExistance(video_id);

    if (rightUserInfo && rightVideoInfo){
        const reaction = await ReactionsManager.getReactionFromUserInVideo(author_id, video_id, positive_reaction);

        if (!reaction) {
            await VideoManager.addReactionToVideo(video_id, positive_reaction);
            const id = await ReactionsManager.insertReaction(author_id, author_name, video_id, positive_reaction);
            res.send({id, author_id, author_name, video_id, positive_reaction});
        } else {
            if (reaction.positive_reaction === positive_reaction){
                res.send("Intentado subir la misma reaccion otra vez");
            } else {
                await ReactionsManager.updateReaction(reaction.id, positive_reaction);
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

module.exports = {
    postReaction,
    validateVideosExistance
}