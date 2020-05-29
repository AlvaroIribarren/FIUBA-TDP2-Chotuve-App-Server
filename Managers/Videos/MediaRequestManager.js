const RequestManager = require("../ExternalManagers/RequestsManager")

const VIDEOS_URL = "https://chotuve-media-server-g5-dev.herokuapp.com/videos";
const IMAGES_URL = "https://chotuve-media-server-g5-dev.herokuapp.com/images"

class MediaRequestManager {

    async getAllVideosFromMedia() {
        const response = await RequestManager.getResponseByLink(VIDEOS_URL);
        return response.data;
    }

    async getAllImagesFromMedia() {
        const response = await RequestManager.getResponseByLink(IMAGES_URL);
        return response.data;
    }

    async getUrlById(src, id) {
        const str = "/" + id;
        const link = src + str;
        const res = await RequestManager.getResponseByLink(link);
        if (res)
            return res.data;
        else
            return null;
    }

    async getImageById(id) {
        return await this.getUrlById(IMAGES_URL, id);
    }

    async getVideoById(id) {
        return await this.getUrlById(VIDEOS_URL, id);
    }

    async addUrlsToVideos(videos) {
        const listOfVideos = [];
        for (let video of videos) {
            const url = await this.getVideoById(video.id);
            if (url) {
                video.url = url.url;
                listOfVideos.push(video);
            } else {
                console.log("No se encontro un video con id: " + video);
            }
        }
        return listOfVideos;
    }

    async getAllVideosWithAddedUrls(videos) {
        return await this.addUrlsToVideos(videos);
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