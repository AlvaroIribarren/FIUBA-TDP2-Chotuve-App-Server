const Manager = require('./DBManager')
const MediaManager = require("./MediaManager")

const videos = 'videos';
const mediaUrl = "https://chotuve-media-server-g5-dev.herokuapp.com/videos";

/*recibo
videoid : int
userid : int
authorname : string
* */

// async function getVideos(){
//     try {
//         return await MediaManager.getResponseByLink(mediaUrl);
//     } catch(e){
//         console.log(e);
//     }
// }

// async function getVideoById(id){
//     const str = "/" + id;
//     const link = mediaUrl + str;
//     return await MediaManager.getResponseByLink(link);
// }

async function getVideos(){
    try {
        const result = Manager.getRows(videos);
        return result;
    } catch(e){
        console.log(e);
    }
}

async function getVideoById(id){
    return await Manager.getIdFromTable(id, videos);
}

async function getAllVideosFromUser(userid){
    const text = 'SELECT * FROM videos WHERE author_id = ' + userid;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows);
    return res.rows;
}

async function createVideoInMedia(json){
    return await MediaManager.generatePost(mediaUrl, json);
}

async function addReactionToVideo(id, positive_reaction){
    if (positive_reaction){
        await addLikeToVideo(id)
    } else {
        await addDislikeToVideo(id);
    }
}

async function addLikeToVideo(id){
    await Manager.incrementRowValueById(id, videos, 'likes');
}

async function addDislikeToVideo(id){
    await Manager.incrementRowValueById(id, videos, 'dislikes');
}

async function insertVideo(author_id, author_name, title, description, location, public, url) {
    const likes = 0;
    const dislikes = 0;
    const text = 'INSERT INTO videos(author_id, author_name, title, description, location, public, url, likes, dislikes) ' +
        'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    const values = [author_id, author_name, title, description, location, public, url, likes, dislikes];
    await Manager.executeQueryInTable(text, values);
}

async function deleteVideoByVideosId(id) {
    console.log("Deleting video");
    const text = 'DELETE FROM videos WHERE id = ' + id;
    await Manager.executeQueryInTableWithoutValues(text);
}

async function deleteAllVideosFromUser(userId){
    console.log("Deleting all videos");
    const text = 'DELETE FROM friends WHERE authorid = ' + userId;
    await Manager.executeQueryInTableWithoutValues(text);
}

const VideosManager = {}
VideosManager.getVideos = getVideos;
VideosManager.getVideoById = getVideoById;
VideosManager.getAllVideosFromUser = getAllVideosFromUser;
VideosManager.insertVideo = insertVideo;
VideosManager.deleteVideoByVideosId = deleteVideoByVideosId;
VideosManager.deleteAllVideosFromUser = deleteAllVideosFromUser;
VideosManager.addReactionToVideo = addReactionToVideo;
VideosManager.createVideoInMedia = createVideoInMedia;

module.exports = VideosManager;