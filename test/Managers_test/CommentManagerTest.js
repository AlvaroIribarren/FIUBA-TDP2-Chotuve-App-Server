const assert = require('chai').assert;

const Manager = require("../../Managers/DBManager")
const CommentManager = require("../../Managers/CommentsManager")

let commentId = 0;
let comment;

const user_id = 28;
const video_id = 85;

const data = {
    "author_id": user_id,
    "video_id": video_id,
    "comment": "Comentario de prueba"
};


describe('Comments test', async function () {
    this.timeout(30000);
    it('Add Comment', async ()=>{
        const length1 = await CommentManager.getAmountOfComments();
        await CommentManager.validateInput(data);
        commentId = await CommentManager.postComment(data, null);
        const length2 = await CommentManager.getAmountOfComments();

        assert.equal(length1+1, length2);
    });

    it('Check comments existance', async () => {
        console.log("Valor de id: " + commentId);
        comment = await CommentManager.getCommentByItsId(commentId);
        assert.notEqual(comment, null);
    })

    it('Check author_id existance', async () =>{
        assert.property(comment, 'author_id');
    })

    it('Check video_id existance', async () =>{
        assert.property(comment, 'video_id');
    })

    it('Check author_name existance', async () =>{
        assert.property(comment, 'author_name');
    })

    it('Check comment property existance', async () =>{
        assert.property(comment, 'comment');
    })

    it('Delete comment', async () =>{
        const length1 = await CommentManager.getAmountOfComments();
        await CommentManager.deleteCommentById(commentId);
        const length2 = await CommentManager.getAmountOfComments();
        assert.equal(length1-1, length2);
    })

    it('Add five comments', async ()=>{
        const length1 = await CommentManager.getAmountOfComments();
        const lengthCommentsFromVideo1 = await CommentManager.getAmountOfCommentsFromVideo(video_id)
        for (let i = 0; i < 5; i++){
            commentId = await CommentManager.postComment(data, null);
        }

        const length2 = await CommentManager.getAmountOfComments();
        const lengthCommentsFromVideo2 = await CommentManager.getAmountOfCommentsFromVideo(video_id);
        assert.equal(length1+5, length2);
        assert.equal(lengthCommentsFromVideo1+5, lengthCommentsFromVideo2);
    });

    it('Deleting five comments by video_id', async ()=>{
        const length1 = await CommentManager.getAmountOfCommentsFromVideo(video_id);
        await CommentManager.deleteAllCommentsFromVideo(video_id);
        const length2 = await CommentManager.getAmountOfCommentsFromVideo(video_id);
        assert.equal(length1, length2+5)
    })

    it('Deleting all videos by user_id', async() => {
        const length1 = await CommentManager.getAmountOfCommentsByUser(user_id);
        for (let i = 0; i < 5; i++){
            commentId = await CommentManager.postComment(data, null);
        }
        const length2 = await CommentManager.getAmountOfCommentsByUser(user_id);
        assert.equal(length1+5, length2);

        await CommentManager.deleteAllCommentsFromUsers(user_id);
        const length3 = await CommentManager.getAmountOfCommentsByUser(user_id);
        assert.equal(length2, length3+5);
    })
});