const ReactionManager = require("../ReactionsManager")
const {validateVideosExistance, postReaction} = require("../Indexes/ReactionIndex")

ReactionManager.validateVideosExistance = validateVideosExistance;
ReactionManager.postReaction = postReaction;

module.exports = ReactionManager;