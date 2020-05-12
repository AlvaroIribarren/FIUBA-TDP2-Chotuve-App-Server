const Manager = require('./DBManager')
const UserManager = require('./UsersManager')
const VideoManager = require('./Videos/VideosManager')
const Joi = require('joi')

const comments = 'comments'

async function getAllComments(){
    try {
        const result = Manager.getRows(comments);
        return result;
    } catch(e){
        console.log(e);
    }
}

async function getCommentByItsId(id){
    return await Manager.getIdFromTable(id, comments);
}

async function getAllCommentsFromVideo(video_id){
    const text = 'SELECT * FROM comments WHERE video_id = ' + video_id;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows);
    return res.rows;
}

async function insertComment(author_id, author_name, video_id, comment) {
    const id = await Manager.generateNewIdInTable(comments);
    const text = 'INSERT INTO comments(id, author_id, author_name, video_id, comment) ' +
        'VALUES($1, $2, $3, $4, $5)';
    const values = [id, author_id, author_name, video_id, comment];
    await Manager.executeQueryInTable(text, values);
    return id;
}

async function deleteCommentById(id) {
    console.log("Deleting video");
    const text = 'DELETE FROM comments WHERE id = ' + id;
    await Manager.executeQueryInTableWithoutValues(text);
}

async function deleteAllCommentsFromVideo(video_id){
    console.log("Deleting all comments");
    const text = 'DELETE FROM friends WHERE video_id = ' + video_id;
    await Manager.executeQueryInTableWithoutValues(text);
}



async function validateUserInfo(author_id, author_name){
    return await UserManager.checkCorrectIdAndName(author_id, author_name);
}

async function validateVideoInfo(video_id){
    return await VideoManager.getVideoById(video_id);
}

async function postComment(data, res){
    const author_id = data.author_id;
    const author_name = data.author_name;
    const video_id = data.video_id;
    const comment = data.comment;
    const rightUserInfo = await validateUserInfo(author_id, author_name);
    const rightVideoInfo = await validateVideoInfo(video_id);

    if (rightUserInfo && rightVideoInfo){
        const id = await CommentManager.insertComment(author_id, author_name, video_id, comment);
        res.send({id, author_id, author_name, video_id, comment});
    } else {
        res.status(404).send("User or videos information is incorrect or doesn't exist.");
    }
}

async function validateInput(body){
    const schema = {
        author_id: Joi.number().positive().required(),
        author_name: Joi.string().required(),
        video_id: Joi.number().positive().required(),
        comment: Joi.string().required(),
    }
    return Joi.validate(body, schema);
}


CommentManager = {};
CommentManager.getAllComments = getAllComments;
CommentManager.getCommentByItsId = getCommentByItsId;
CommentManager.getAllCommentsFromVideo = getAllCommentsFromVideo;
CommentManager.insertComment = insertComment;
CommentManager.deleteCommentById = deleteCommentById;
CommentManager.deleteAllCommentsFromVideo = deleteAllCommentsFromVideo;
CommentManager.postComment = postComment;
CommentManager.validateInput = validateInput;

module.exports = CommentManager;