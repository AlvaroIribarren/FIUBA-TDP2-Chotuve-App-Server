const Manager = require('../DBManager')
const UserManager = require('../Users/UsersManager')

const Joi = require('joi')

const reactions = 'reactions'

class ReactionsManager {
    async getAllReactions() {
        try {
            let allReactions = Manager.getRows(reactions);
            allReactions = await UserManager.addNamesToElements(allReactions);
            return allReactions;
        } catch (e) {
            console.log(e);
        }
    }

    async getReactionById(id) {
        let reaction = await Manager.getIdFromTable(id, reactions);
        reaction = await UserManager.addNameToElementById(id, reaction);
        return reaction;
    }

    async getAllReactionsFromVideo(video_id) {
        const condition = ' video_id = ' + video_id;
        let allReactions = await Manager.getAllRowsWithCondition(reactions, condition);
        allReactions = await UserManager.addNamesToElements(allReactions);
        return allReactions;
    }

    async didUserReactToVideo(author_id, video_id, reaction_condition){
        const search = "author_id = " + author_id + " AND " + " video_id = " + video_id;
        const condition = search + " " + reaction_condition;
        return await Manager.getAllRowsWithCondition(reactions, condition);
    }

    async didUserLikedTheVideo(author_id, video_id){
        const reaction_condition = " positive_reaction = true ";
        return await this.didUserReactToVideo(author_id, video_id, reaction_condition);
    }

    async didUserDislikedTheVideo(author_id, video_id){
        const reaction_condition = " positive_reaction = false ";
        return await this.didUserReactToVideo(author_id, video_id, reaction_condition);
    }

    async insertReaction(author_id, video_id, positive_reaction) {
        const id = await Manager.generateNewIdInTable(reactions);
        const text = 'INSERT INTO reactions(id, author_id, video_id, positive_reaction) ' +
            'VALUES($1, $2, $3, $4)';
        const values = [id, author_id, video_id, positive_reaction];
        await Manager.executeQueryInTable(text, values);
        return id;
    }

    async deleteReactionById(id) {
        console.log("Deleting reaction id:" + id);
        return await Manager.deleteRowFromTableById(id, reactions);
    }

    async deleteAllReactionsFromVideo(video_id) {
        console.log("Deleting all reactions from video: " + video_id);
        const condition = ' video_id = ' + video_id;
        return await Manager.deleteAllRowsWithCondition(reactions, condition);
    }

    async deleteAllReactionsFromUser(user_id) {
        console.log("Deleting all reactions from user");
        const condition = ' author_id = ' + user_id;
        return await Manager.deleteAllRowsWithCondition(reactions, condition);
    }

    async getReactionFromUserInVideo(author_id, video_id) {
        const condition = ' author_id =' + author_id + ' AND video_id =' + video_id;
        let filteredReactions = await Manager.getAllRowsWithCondition(reactions, condition);
        filteredReactions = await UserManager.addNamesToElements(filteredReactions);
        if (filteredReactions.length > 0)
            return filteredReactions[0];
        else
            return null;
    }

    async updateReaction(id, positive_reaction) {
        return await Manager.updateRowWithNewValue(id, reactions, 'positive_reaction', positive_reaction);
    }

    async validateInput(body) {
        const schema = {
            author_id: Joi.number().positive().required(),
            video_id: Joi.number().positive().required(),
            positive_reaction: Joi.boolean().required(),
        }
        return Joi.validate(body, schema);
    }
}

module.exports = new ReactionsManager();