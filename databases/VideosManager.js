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

async function getAllVideosFromUser(userid){
    const text = 'SELECT * FROM videos WHERE author_id = ' + userid;
    const res = await Manager.executeQueryInTableWithoutValues(text);
    console.log(res.rows);
    return res.rows;
}   



async function insertVideo(author_id, author_name, title, description, location, public, url) {
    const id = await Manager.generateNewIdInTable(videos);
    const text = 'INSERT INTO videos(id, author_id, author_name, title, description, location, public, url) ' +
        'VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [id, author_id, author_name, title, description, location, public, url];
    await Manager.executeQueryInTable(text, values);
    return id;
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

async function turnBooleanIntoBit(boolean){
    return await Manager.turnBooleanToBit(boolean);
}

async function turnBitIntoBoolean(bit) {
    return await Manager.turnBitToBoolean(bit);
}



const VideosManager = {}
VideosManager.getVideos = getVideos;
VideosManager.getVideoById = getVideoById;
VideosManager.getAllVideosFromUser = getAllVideosFromUser;
VideosManager.insertVideo = insertVideo;
VideosManager.deleteVideoByVideosId = deleteVideoByVideosId;
VideosManager.deleteAllVideosFromUser = deleteAllVideosFromUser;
VideosManager.turnBitIntoBoolean = turnBitIntoBoolean;
VideosManager.turnBooleanIntoBit =turnBooleanIntoBit;

module.exports = VideosManager;