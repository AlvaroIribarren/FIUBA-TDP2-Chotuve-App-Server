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

// async function getRelationByUsersIds(id1, id2){
//     console.log("Relation between 2 users");
//     const text = 'SELECT * FROM videos WHERE id1 = ' + id1 + ' AND id2 = ' + id2;
//     const res = await Manager.executeQueryInTableWithoutValues(text);
//     console.log(res.rows[0]);
//     return res.rows[0];
// }

async function insertVideo(authorid, authorname) {
    const id = await Manager.generateNewIdInTable(videos);
    const text = 'INSERT INTO videos(id, authorid, authorname) VALUES($1, $2, $3)';
    const values = [id, authorid, authorname];
    await Manager.executeQueryInTable(text, values);
}

async function deleteVideoByVideosId(id) {
    console.log("Deleting video");
    const text = 'DELETE FROM videos WHERE id = ' + id;
    await Manager.executeQueryInTableWithoutValues(text);
}

async function deleteAllVideosFromUser(userId){

}


const VideosManager = {}
VideosManager.getVideos = getVideos;
VideosManager.getRelationById = getVideoById;
VideosManager.insertVideo = insertVideo;
VideosManager.deleteVideoByVideosId = deleteVideoByVideosId;
VideosManager.deleteAllVideosFromUser = deleteAllVideosFromUser;

module.exports = VideosManager;