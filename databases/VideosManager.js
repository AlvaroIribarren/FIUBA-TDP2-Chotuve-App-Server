const Manager = require('./DBManager')
const UserManager = require('./UsersManager')

const videos = 'videos'

/*recibo
videoid : int
userid : int
authorname : string
* */

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

async function insertVideo(author_id, author_name, title, description, location, public, url) {
    const id = await Manager.generateNewIdInTable(videos);
    const text = 'INSERT INTO videos(id, author_id, author_name, title, description, location, public, url) ' +
        'VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [id, author_id, author_name, title, description, location, public, url];
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
VideosManager.insertVideo = insertVideo;
VideosManager.deleteVideoByVideosId = deleteVideoByVideosId;
VideosManager.deleteAllVideosFromUser = deleteAllVideosFromUser;

module.exports = VideosManager;