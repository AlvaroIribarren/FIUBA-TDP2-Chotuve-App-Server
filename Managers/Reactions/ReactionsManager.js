const Manager = require('../DBManager')
const UserManager = require('../Users/UsersManager')

const Joi = require('joi')

const reactions = 'reactions'

class ReactionsManager {
    async getAllReactions() {
        try {
            return Manager.getRows(reactions);
        } catch (e) {
            console.log(e);
        }
    }

    async getReactionById(id) {
        return await Manager.getIdFromTable(id, reactions);
    }

    async getAllReactionsFromVideo(video_id) {
        const text = 'SELECT * FROM reactions WHERE video_id = ' + video_id;
        const res = await Manager.executeQueryInTableWithoutValues(text);
        console.log(res.rows);
        return res.rows;
    }

    async didUserReactToVideo(author_id, video_id, reaction_condition){
        const search = "author_id = " + author_id + " AND " + " video_id = " + video_id;
        const condition = search + " " + reaction_condition;
        const result = await Manager.getAllRowsWithCondition(reactions, condition);
        return result;
    }

    async didUserLikedTheVideo(author_id, video_id){
        const reaction_condition = " positive_reaction = true ";
        return await this.didUserReactToVideo(author_id, video_id, reaction_condition);
    }

    async didUserDislikedTheVideo(author_id, video_id){
        const reaction_condition = " positive_reaction = false ";
        return await this.didUserReactToVideo(author_id, video_id, reaction_condition);
    }

    async insertReaction(author_id, author_name, video_id, positive_reaction) {
        const id = await Manager.generateNewIdInTable(reactions);
        const text = 'INSERT INTO reactions(id, author_id, author_name, video_id, positive_reaction) ' +
            'VALUES($1, $2, $3, $4, $5)';
        const values = [id, author_id, author_name, video_id, positive_reaction];
        await Manager.executeQueryInTable(text, values);
        return id;
    }

    async deleteReactionById(id) {
        console.log("Deleting video");
        await Manager.deleteRowFromTableById(id, reactions);
    }

    async deleteAllReactionsFromVideo(video_id) {
        console.log("Deleting all reactions");
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
        const filteredReactions = await Manager.getAllRowsWithCondition(reactions, condition);
        if (filteredReactions.length > 0)
            return filteredReactions[0];
        else
            return null;
    }

    async validateUserInfo(author_id, author_name) {
        return await UserManager.checkCorrectIdAndName(author_id, author_name);
    }

    async updateReaction(id, positive_reaction) {
        return await Manager.updateRowWithNewValue(id, reactions, 'positive_reaction', positive_reaction);
    }

    async validateInput(body) {
        const schema = {
            author_id: Joi.number().positive().required(),
            author_name: Joi.string().required(),
            video_id: Joi.number().positive().required(),
            positive_reaction: Joi.boolean().required(),
        }
        return Joi.validate(body, schema);
    }
}

const reactionsManager = new ReactionsManager();
module.exports = reactionsManager;