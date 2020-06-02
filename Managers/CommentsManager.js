const Manager = require('./DBManager')
const UserManager = require('./Users/UsersManager')

const Joi = require('joi')

const comments = 'comments';

class CommentsManager {
    async getAllComments() {
        try {
            return Manager.getRows(comments);
        } catch (e) {
            console.log(e);
        }
    }

    async getCommentByItsId(id) {
        return await Manager.getIdFromTable(id, comments);
    }

    async getAllCommentsFromVideo(video_id) {
        const text = 'SELECT * FROM comments WHERE video_id = ' + video_id;
        const res = await Manager.executeQueryInTableWithoutValues(text);
        console.log(res.rows);
        return res.rows;
    }

    async getAmountOfCommentsFromVideo(video_id){
        const videos = await this.getAllCommentsFromVideo(video_id);
        return videos.length;
    }

    async insertComment(author_id, author_name, video_id, comment) {
        const id = await Manager.generateNewIdInTable(comments);
        const text = 'INSERT INTO comments(id, author_id, author_name, video_id, comment) ' +
            'VALUES($1, $2, $3, $4, $5)';
        const values = [id, author_id, author_name, video_id, comment];
        await Manager.executeQueryInTable(text, values);
        return id;
    }

    async deleteCommentById(id) {
        console.log("Deleting video");
        const condition = ' id = ' + id;
        return await Manager.executeQueryInTableWithoutValues(condition);
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

    async validateUserInfo(author_id, author_name) {
        return await UserManager.checkCorrectIdAndName(author_id, author_name);
    }


    async postComment(data, res) {
        const author_id = data.author_id;
        const author_name = data.author_name;
        const video_id = data.video_id;
        const comment = data.comment;
        const rightUserInfo = await this.validateUserInfo(author_id, author_name);


        if (rightUserInfo) {
            const id = await this.insertComment(author_id, author_name, video_id, comment);
            res.send({id, author_id, author_name, video_id, comment});
        } else {
            res.status(404).send("User or videos information is incorrect or doesn't exist.");
        }
    }

    async validateInput(body) {
        const schema = {
            author_id: Joi.number().positive().required(),
            author_name: Joi.string().required(),
            video_id: Joi.number().positive().required(),
            comment: Joi.string().required(),
        }
        return Joi.validate(body, schema);
    }
}

const commentManager = new CommentsManager();
module.exports = commentManager;
