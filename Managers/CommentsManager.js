const Manager = require('./DBManager')
const UserManager = require('./Users/UsersManager')

const Joi = require('joi')

const comments = 'comments';

class CommentsManager {
    async getAllComments() {
        try {
            let allComments = await Manager.getRows(comments);
            allComments = await UserManager.addNamesToElements(allComments);
            return allComments;
        } catch (e) {
            console.log(e);
        }
    }

    async getAmountOfComments(){
        const comments = await this.getAllComments();
        return comments.length;
    }

    async getCommentByItsId(id) {
        let comment = await Manager.getIdFromTable(id, comments);
        comment = await UserManager.addNameToElementById(id, comment);
        return comment;
    }

    async getAllCommentsFromVideo(video_id) {
        const condition = ' video_id = ' + video_id;
        return await Manager.getAllRowsWithCondition(comments, condition);
    }

    async getAllCommentsFromUser(user_id) {
        const condition = ' author_id = ' + user_id;
        let allComments = await Manager.getAllRowsWithCondition(comments, condition);
        allComments = await UserManager.addNamesToElements(allComments);
        return allComments;
    }

    async getAmountOfCommentsByUser(user_id) {
        const allComments = await this.getAllCommentsFromUser(user_id);
        return allComments.length;
    }

    async getAmountOfCommentsFromVideo(video_id){
        const videos = await this.getAllCommentsFromVideo(video_id);
        return videos.length;
    }

    async insertComment(author_id, video_id, comment) {
        const id = await Manager.generateNewIdInTable(comments);
        const text = 'INSERT INTO comments(id, author_id, video_id, comment) ' +
            'VALUES($1, $2, $3, $4)';
        const values = [id, author_id, video_id, comment];
        await Manager.executeQueryInTable(text, values);
        return id;
    }

    async deleteCommentById(id) {
        return await Manager.deleteRowFromTableById(id, comments);
    }

    async deleteAllCommentsFromVideo(video_id) {
        console.log("Deleting all comments");
        const condition = ' video_id = ' + video_id;
        await Manager.deleteAllRowsWithCondition(comments, condition);
    }

    async deleteAllCommentsFromUsers(user_id) {
        const condition = ' author_id = ' + user_id;
        return await Manager.deleteAllRowsWithCondition(comments, condition);
    }

    async postComment(data, res) {
        const author_id = data.author_id;
        const video_id = data.video_id;
        const comment = data.comment;
        const correctUser = await UserManager.doesUserExist(author_id);

        if (correctUser) {
            const id = await this.insertComment(author_id, video_id, comment);
            if (res)
                res.send({id, author_id, video_id, comment});

            return id;
        } else {
            res.status(404).send("User or videos information is incorrect or doesn't exist.");
        }
    }

    async validateInput(body) {
        const schema = {
            author_id: Joi.number().positive().required(),
            video_id: Joi.number().positive().required(),
            comment: Joi.string().required(),
        }
        return Joi.validate(body, schema);
    }
}

const commentManager = new CommentsManager();
module.exports = commentManager;
