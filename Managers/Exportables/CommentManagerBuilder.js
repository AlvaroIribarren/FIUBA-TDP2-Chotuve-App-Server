const CommentManager = require("../CommentsManager")
const validateVideoInfo = require("../Indexes/CommentIndex")

CommentManager.validateVideoInfo = validateVideoInfo;

module.exports = CommentManager;
