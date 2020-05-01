const Manager = require('./DBManager')
const UserManager = require('./UsersManager')

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


CommentManager = {};
CommentManager.getAllComments = getAllComments;
CommentManager.getCommentByItsId = getCommentByItsId;
CommentManager.getAllCommentsFromVideo = getAllCommentsFromVideo;
CommentManager.insertComment = insertComment;
CommentManager.deleteCommentById = deleteCommentById;
CommentManager.deleteAllCommentsFromVideo = deleteAllCommentsFromVideo;


module.exports = CommentManager;