const Manager = require('../DBManager')
const VideoRequestManager = require("../Videos/MediaRequestManager")
const UserManager = require("../Users/UsersManager")
const RulesEngine = require("../../Rules/RulesEngine")
const CommentManager = require("../CommentsManager")
const ReactionManager = require("../Reactions/ReactionsManager")
const SearchManager = require("../SearchManager")
const InformationCollector = require("../../Rules/InformationCollector")
const DistanceCalculator = require("../../Utils/DistanceCalculator")

const videos = 'videos';

class VideosManager {
    async getVideos() {
        try {
            let videos = await this.getVideosInAppServer();
            videos = videos.filter(video => video.public_video === true);
            videos = await VideoRequestManager.getAllVideosWithAddedInfo(videos);
            videos = await UserManager.addNamesToElements(videos);
            return videos;
        } catch (e) {
            console.log(e);
        }
    }

    async getAmountOfVideos(){
        const allVideos = await Manager.getRows(videos);
        return allVideos.length;
    }

    async getVideosWithImportance(requester_id){
        let videos = await this.getVideos();
        const videosWithoutInfo = JSON.parse(JSON.stringify(videos));
        await InformationCollector.addInformationToVideos(requester_id, videos);

        await RulesEngine.getImportanceOnVideos(requester_id, videos).then(
                function() {
                    console.log(videos)
                });

        for (let video of videos){
            const actualVideoToAddImportance = videosWithoutInfo.filter(vid => vid.id === video.id);
            actualVideoToAddImportance[0].importance = video.importance;
        }

        return videosWithoutInfo;
    }

    async getVideoWithNoUrlById(id){
        let actualVideo = await this.getVideoByIdInAppServer(id);
        actualVideo = await UserManager.addNameToElementById(id, actualVideo);
        return actualVideo;
    }

    async doesVideoExist(video_id){
        const condition = " id = " + video_id;
        return await Manager.getAllRowsWithCondition(videos, condition);
    }

    async getVideoById(id) {
        const mediaInfo = await VideoRequestManager.getVideoById(id);
        const videoInAppSv = await this.getVideoByIdInAppServer(mediaInfo.id);
        if (mediaInfo && videoInAppSv) {
            videoInAppSv.url = mediaInfo.url;
            videoInAppSv.video_size = mediaInfo.video_size;
            return videoInAppSv;
        } else {
            return null;
        }
    }

    async getVideoByIdInAppServer(id) {
        let video = await Manager.getIdFromTable(id, videos);
        const author_id = video.author_id;
        video = await UserManager.addNameToElementById(author_id, video);
        return video;
    }

    async getVideosInAppServer() {
        let allVideos = await Manager.getRows(videos);
        allVideos = await UserManager.addNamesToElements(allVideos);
        return allVideos;
    }

    async getAllVideosFromUser(userid, showPrivateVideos) {
        const condition = ' author_id = ' + userid;
        let allVideos = await Manager.getAllRowsWithCondition(videos, condition);
        allVideos = await UserManager.addNamesToElements(allVideos);
        let videosWithUrls = await VideoRequestManager.addMediaInfoToVideos(allVideos);

        if (!showPrivateVideos) { //muestro solo los publicos
            videosWithUrls = videosWithUrls.filter(video => video.public_video === true);
        }
        return videosWithUrls;
    }

    async getAmountOfVideosFromUser(userId, showPrivateVideos){
        const allVideos = await this.getAllVideosFromUser(userId, showPrivateVideos);
        return allVideos.length;
    }

    async createVideoInMedia(json) {
        return await VideoRequestManager.postVideoToMedia(json);
    }

    async addReactionToVideo(id, positive_reaction) {
        if (positive_reaction) {
            await this.addLikeToVideo(id)
        } else {
            await this.addDislikeToVideo(id);
        }
    }

    async deleteReactionFromVideo(video_id, positive_reaction) {
        if (positive_reaction) {
            await this.subLikeToVideo(video_id);
        } else {
            await this.subDislikeToVideo(video_id);
        }
    }

    async addViewToVideo(id) {
        await Manager.incrementRowValueById(id, videos, 'views');
    }

    async addLikeToVideo(id) {
        await Manager.incrementRowValueById(id, videos, 'likes');
    }

    async addDislikeToVideo(id) {
        await Manager.incrementRowValueById(id, videos, 'dislikes');
    }

    async subLikeToVideo(id) {
        await Manager.updateRowWithNewValue(id, videos, 'likes', 'likes - 1');
    }

    async subDislikeToVideo(id) {
        await Manager.updateRowWithNewValue(id, videos, 'dislikes', 'dislikes - 1');
    }

    async getLikesFromVideo(id){
        const actualVideo = await Manager.getIdFromTable(id, videos);
        return actualVideo.likes;
    }

    async getDislikesFromVideo(id){
        const actualVideo = await Manager.getIdFromTable(id, videos);
        return actualVideo.dislikes;
    }

    async insertVideo(id, author_id, title, description, location, public_video) {
        const text = 'INSERT INTO videos(id, author_id, title, description, location, public_video) ' +
            'VALUES($1, $2, $3, $4, $5, $6)';
        const values = [id, author_id, title, description, location, public_video];
        await Manager.executeQueryInTable(text, values);
    }

    async deleteVideoByVideosId(id) {
        console.log("Deleting video");
        await Manager.deleteRowFromTableById(id, videos);
        await VideoRequestManager.deleteVideoById(id);

        await CommentManager.deleteAllCommentsFromVideo(id);
        await ReactionManager.deleteAllReactionsFromVideo(id);
    }

    async deleteAllVideosFromUser(userId) {
        console.log("Deleting all videos from user");
        const videos = await this.getAllVideosFromUser(userId, true);

        for (let video of videos) {
            await this.deleteVideoByVideosId(video.id);
        }
    }

//post: returns related videos by user's search. The video is related if
//the string is the same or if the search is included in the video's title.
    async getSearchRelatedVideos(videos, search) {
        await SearchManager.addSearch(search);
        const listOfVideos = [];
        for (let video of videos) {
            if (video.public_video) {
                let title = video.title;
                const similarity = await DistanceCalculator.similarity(title, search);
                console.log("Similaritiy: " + similarity + " of video: " + video.id);
                if (similarity > 0.3){
                    video.importance = (video.importance + similarity)/2;
                    listOfVideos.push(video);
                }
            }
        }
        return listOfVideos;
    }

    async modifiyVideo(video_id, key, newValue){
        newValue = "'" + newValue + "'";
        await Manager.updateRowWithNewValue(video_id, videos, key, newValue);
    }

    async isVideoEnabled(video_id){
        const video = await this.getVideoByIdInAppServer(video_id);
        return video.enabled;
    }

    async enableVideo(video_id) {
        return await Manager.turnColumnValueToTrueById(video_id, videos, ' enabled ');
    }

    async disableVideo(video_id){
        const value = await Manager.turnColumnValueToFalseById(video_id, videos, ' enabled ');
        return value.rowCount;
    }

    async getTotalViews(){
        let acum = 0;
        const videos = await this.getVideosInAppServer();
        for (let actualVideo of videos){
            acum += actualVideo.views;
        }
        return acum;
    }

    async postVideo(data, res){
        const author_id = parseInt(data.author_id);
        const rightUserInfo = await UserManager.doesUserExist(author_id);

        if (rightUserInfo){
            const title = data.title;
            const description = data.description;
            const location = data.location;
            const public_video = data.public_video;

            const url = data.url;
            const uuid = data.uuid;
            let video_size = data.video_size;
            video_size = video_size.replace(",", ".");

            const resultFromMedia = await this.createVideoInMedia({url, uuid, video_size});
            const id = resultFromMedia.data.id;

            await this.insertVideo(id, author_id, title, description, location, public_video);
            if (res)
                res.send({id, author_id, title, description, public_video, url, location, uuid});
            return id;
        } else {
            if (res)
                res.status(404).send("Author's id or name was not found");
        }
    }
}

const videosManager = new VideosManager();
module.exports = videosManager;