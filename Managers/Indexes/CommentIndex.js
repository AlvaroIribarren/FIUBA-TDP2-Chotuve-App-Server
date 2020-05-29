const VideoManager = require('../Videos/VideosManager')


async function validateVideoInfo(video_id) {
    return await VideoManager.getVideoById(video_id);
}

module.exports = validateVideoInfo;