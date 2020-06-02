const Manager = require('../DBManager')
const VideoRequestManager = require("../Videos/MediaRequestManager")
const RulesEngine = require("../../Rules/RulesEngine")
const CommentManager = require("../CommentsManager")
const ReactionManager = require("../Reactions/ReactionsManager")
const InformationCollector = require("../../Rules/InformationCollector")
const DistanceCalculator = require("../../Utils/DistanceCalculator")

const videos = 'videos';

class VideosManager {
    async getVideos() {
        try {
            let videos = await this.getVideosInAppServer();
            videos = videos.filter(video => video.public_video === true);
            return VideoRequestManager.getAllVideosWithAddedUrls(videos);
        } catch (e) {
            console.log(e);
        }
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
        return await this.getVideoByIdInAppServer(id);
    }

    async doesVideoExist(video_id){
        const condition = " id = " + video_id;
        const result = await Manager.getAllRowsWithCondition(videos, condition);
        return result;
    }

    async getVideoById(id) {
        const url = await VideoRequestManager.getVideoById(id);
        const videoInAppSv = await this.getVideoByIdInAppServer(url.id);
        if (url && videoInAppSv) {
            videoInAppSv.url = url.url;
            return videoInAppSv;
        } else {
            return null;
        }
    }

    async getVideoByIdInAppServer(id) {
        return await Manager.getIdFromTable(id, videos);
    }

    async getVideosInAppServer() {
        return await Manager.getRows(videos);
    }

    async getAllVideosFromUser(userid, showPrivateVideos) {
        const condition = ' author_id = ' + userid;
        const allVideos = await Manager.getAllRowsWithCondition(videos, condition);
        let videosWithUrls = await VideoRequestManager.addUrlsToVideos(allVideos);

        if (!showPrivateVideos) { //muestro solo los publicos
            videosWithUrls = videosWithUrls.filter(video => video.public_video === true);
        }
        return videosWithUrls;
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

    async insertVideo(id, author_id, author_name, title, description, location, public_video) {
        const text = 'INSERT INTO videos(id, author_id, author_name, title, description, location, public_video) ' +
            'VALUES($1, $2, $3, $4, $5, $6, $7)';
        const values = [id, author_id, author_name, title, description, location, public_video];

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
            await VideoRequestManager.deleteVideoById(video.id);
            await this.deleteVideoByVideosId(video.id);
        }
    }

//post: returns related videos by user's search. The video is related if
//the string is the same or if the search is included in the video's title.
    async getSearchRelatedVideos(videos, search) {
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
}

const videosManager = new VideosManager();
module.exports = videosManager;