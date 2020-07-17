const RequestManager = require("../ExternalManagers/RequestsManager")

const VIDEOS_URL = "https://chotuve-media-server-g5-dev.herokuapp.com/videos";
const IMAGES_URL = "https://chotuve-media-server-g5-dev.herokuapp.com/images"

class MediaRequestManager {

    async getAllInfo() {
        const response = await RequestManager.getResponseByLink(VIDEOS_URL);
        return response.data;
    }

    async getAllImagesFromMedia() {
        const response = await RequestManager.getResponseByLink(IMAGES_URL);
        return response.data;
    }

    async getMediaInfoById(src, id) {
        const str = "/" + id;
        const link = src + str;
        const res = await RequestManager.getResponseByLink(link);
        if (res)
            return res.data;
        else
            return null;
    }

    async getImageById(id) {
        return await this.getMediaInfoById(IMAGES_URL, id);
    }

    async getVideoById(id) {
        return await this.getMediaInfoById(VIDEOS_URL, id);
    }

    async addMediaInfoToVideos(videos) {
        const listOfVideos = [];
        const info = await this.getAllInfo();
        for (let video of videos) {
            const actualInfo = info.filter(element => element.id === video.id);
            if (actualInfo) {
                video.url = actualInfo[0].url;
                video.video_size = actualInfo[0].video_size;
                listOfVideos.push(video);
            } else {
                console.log("No se encontro un video con id: " + video);
            }
        }
        return listOfVideos;
    }

    async getAllVideosWithAddedInfo(videos) {
        videos = await this.addMediaInfoToVideos(videos);
        return videos;
    }

    async postVideoToMedia(video) {
        return await RequestManager.generatePost(VIDEOS_URL, video);
    }

    async postImageToMedia(image) {
        return await RequestManager.generatePost(IMAGES_URL, image);
    }

    async changeProfileImage(img_id, img_url, img_uuid) {
        const imageLinkWithId = IMAGES_URL + "/" + img_id;
        const data = {
            url: img_url,
            uuid: img_uuid
        }
        return await RequestManager.generatePutRequest(imageLinkWithId, data);
    }

    async deleteById(src, id) {
        return await RequestManager.deleteById(src, id);
    }

    async deleteVideoById(id) {
        return await this.deleteById(VIDEOS_URL, id);
    }

    async deleteImageById(id) {
        return await this.deleteById(IMAGES_URL, id);
    }
}

const mediaRequestManager = new MediaRequestManager();
module.exports = mediaRequestManager;