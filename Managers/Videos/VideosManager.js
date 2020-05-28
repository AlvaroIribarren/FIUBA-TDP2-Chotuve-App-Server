const Manager = require('../DBManager')
const VideoRequestManager = require("./MediaRequestManager")
const CommentManager = require("../CommentsManager")
const ReactionManager = require("../ReactionsManager")

const videos = 'videos';

async function getVideos(){
    try {
        let videos = await getVideosInAppServer();
        videos = videos.filter(video => video.public === true);
        return VideoRequestManager.getAllVideosWithAddedUrls(videos);
    } catch(e){
        console.log(e);
    }
}

async function getVideoById(id) {
    const url = await VideoRequestManager.getVideoById(id);
    const videoInAppSv = await getVideoByIdInAppServer(url.id);
    if (url && videoInAppSv) {
        videoInAppSv.url = url.url;
        return videoInAppSv;
    } else {
        return null;
    }
}

async function getVideoByIdInAppServer(id){
    return await Manager.getIdFromTable(id, videos);
}

async function getVideosInAppServer(){
    return await Manager.getRows(videos);
}

async function getAllVideosFromUser(userid, showPrivateVideos){
    const condition = ' author_id = ' + userid;
    const allVideos = await Manager.getAllRowsWithCondition(videos, condition);
    let videosWithUrls =  await VideoRequestManager.addUrlsToVideos(allVideos);

    if (!showPrivateVideos){ //muestro solo los publicos
        videosWithUrls = videosWithUrls.filter(video => video.public === true);
    }
    return videosWithUrls;
}

async function createVideoInMedia(json){
    return await VideoRequestManager.postVideoToMedia(json);
}

async function addReactionToVideo(id, positive_reaction){
    if (positive_reaction){
        await addLikeToVideo(id)
    } else {
        await addDislikeToVideo(id);
    }
}

async function deleteReactionFromVideo(video_id, positive_reaction){
    if (positive_reaction){
        await subLikeToVideo(video_id);
    } else {
        await subDislikeToVideo(video_id);
    }
}

async function addLikeToVideo(id){
    await Manager.incrementRowValueById(id, videos, 'likes');
}

async function addDislikeToVideo(id){
    await Manager.incrementRowValueById(id, videos, 'dislikes');
}

async function subLikeToVideo(id){
    await Manager.updateRowWithNewValue(id, videos, 'likes', 'likes - 1');
}

async function subDislikeToVideo(id){
    await Manager.updateRowWithNewValue(id, videos, 'dislikes', 'dislikes - 1');
}

async function insertVideo(id, author_id, author_name, title, description, location, public, uuid) {
    const likes = 0;
    const dislikes = 0;
    const text = 'INSERT INTO videos(id, author_id, author_name, title, description, location, public, likes, dislikes, uuid) ' +
        'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const values = [id, author_id, author_name, title, description, location, public, likes, dislikes, uuid];

    await Manager.executeQueryInTable(text, values);
}

async function deleteVideoByVideosId(id) {
    console.log("Deleting video");
    const condition = ' id = ' + id;
    await Manager.executeQueryInTableWithoutValues(condition);

    await CommentManager.deleteAllCommentsFromVideo(id);
    await ReactionManager.deleteAllReactionsFromVideo(id);
}

async function deleteAllVideosFromUser(userId){
    console.log("Deleting all videos from user");
    const videos = await getAllVideosFromUser(userId, true);

    for (let video of videos){
        await VideoRequestManager.deleteVideoById(video.id);
        await deleteVideoByVideosId(video.id);
    }
}

//post: returns related videos by user's search. The video is related if
//the string is the same or if the search is included in the video's title.
async function getSearchRelatedVideos(videos, search){
    const listOfVideos = [];
    for (let video of videos){
        if (video.public){
            let title = video.title.toUpperCase();
            search = search.toUpperCase();
            search = search.replace(/_/g, ' ');
            const areEqual = (title === search);
            const isASubString = title.includes(search);
            if (areEqual || isASubString){
                listOfVideos.push(video);
            }
        }
    }
    return listOfVideos;
}

const VideosManager = {}
VideosManager.getVideos = getVideos;
VideosManager.getVideoById = getVideoById;
VideosManager.getAllVideosFromUser = getAllVideosFromUser;
VideosManager.getVideosInAppServer = getVideosInAppServer;
VideosManager.insertVideo = insertVideo;
VideosManager.deleteVideoByVideosId = deleteVideoByVideosId;
VideosManager.deleteAllVideosFromUser = deleteAllVideosFromUser;
VideosManager.addReactionToVideo = addReactionToVideo;
VideosManager.createVideoInMedia = createVideoInMedia;
VideosManager.getSearchRelatedVideos = getSearchRelatedVideos;
VideosManager.deleteReactionFromVideo = deleteReactionFromVideo;

module.exports = VideosManager;