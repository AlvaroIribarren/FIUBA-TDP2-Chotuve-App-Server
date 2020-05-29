const Manager = require('../DBManager')
const VideoRequestManager = require("../Videos/MediaRequestManager")
const CommentManager = require("../CommentsManager")
const ReactionManager = require("../ReactionsManager")

const videos = 'videos';

class VideosManager {
    async getVideos() {
        try {
            let videos = await this.getVideosInAppServer();
            videos = videos.filter(video => video.public === true);
            return VideoRequestManager.getAllVideosWithAddedUrls(videos);
        } catch (e) {
            console.log(e);
        }
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
            videosWithUrls = videosWithUrls.filter(video => video.public === true);
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
        const likes = 0;
        const dislikes = 0;
        const text = 'INSERT INTO videos(id, author_id, author_name, title, description, location, public_video, likes, dislikes) ' +
            'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        const values = [id, author_id, author_name, title, description, location,
            public_video, likes, dislikes];

        await Manager.executeQueryInTable(text, values);
    }

    async deleteVideoByVideosId(id) {
        console.log("Deleting video");
        const condition = ' id = ' + id;
        await Manager.executeQueryInTableWithoutValues(condition);

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
            if (video.public) {
                let title = video.title.toUpperCase();
                search = search.toUpperCase();
                search = search.replace(/_/g, ' ');
                const areEqual = (title === search);
                const isASubString = title.includes(search);
                if (areEqual || isASubString) {
                    listOfVideos.push(video);
                }
            }
        }
        return listOfVideos;
    }
}

const videosManager = new VideosManager();
module.exports = videosManager;