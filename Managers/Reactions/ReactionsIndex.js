const VideoManager = require("../Videos/VideosManager")
const ReactionManager = require("../Reactions/ReactionsManager")

async function postReaction(data, res) {
    const author_id = data.author_id;
    const author_name = data.author_name;
    const video_id = data.video_id;
    const positive_reaction = data.positive_reaction;

    const reaction = await ReactionManager.getReactionFromUserInVideo(author_id, video_id, positive_reaction);

    if (!reaction) {
        await VideoManager.addReactionToVideo(video_id, positive_reaction);
        const id = await ReactionManager.insertReaction(author_id, author_name, video_id, positive_reaction);
        res.send({id, author_id, author_name, video_id, positive_reaction});
    } else {
        if (reaction.positive_reaction === positive_reaction) {
            res.send("Intentado subir la misma reaccion otra vez");
        } else {
            await ReactionManager.updateReaction(reaction.id, positive_reaction);
            const reactionToBeDeleted = !(positive_reaction);
            await VideoManager.deleteReactionFromVideo(video_id, reactionToBeDeleted);
            await VideoManager.addReactionToVideo(video_id, positive_reaction);
            const id = reaction.id;
            res.send({id, author_id, author_name, video_id, positive_reaction});
        }
    }
}

module.exports = postReaction;