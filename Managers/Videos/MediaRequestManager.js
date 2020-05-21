const RequestManager = require("../ExternalManagers/RequestsManager")

const VIDEOS_URL = "https://chotuve-media-server-g5-dev.herokuapp.com/videos";
const IMAGES_URL = "https://chotuve-media-server-g5-dev.herokuapp.com/images"

async function getAllVideosFromMedia(){
    const response =  await RequestManager.getResponseByLink(VIDEOS_URL);
    return response.data;
}

async function getAllImagesFromMedia(){
    const response = await RequestManager.getResponseByLink(IMAGES_URL);
    return response.data;
}

async function getUrlById(id){
    const str = "/" + id;
    const link = VIDEOS_URL + str;
    const res = await RequestManager.getResponseByLink(link);
    if (res)
        return res.data;
    else
        return null;
}

async function getImageById(id){
    return await getUrlById(IMAGES_URL, id);
}

async function getVideoById(id){
    return await getUrlById(VIDEOS_URL, id);
}

async function addUrlsToVideos(videos){
    const listOfVideos = [];
    for (let video of videos){
        const url = await getUrlById(video.id);
        if (url) {
            video.url = url.url;
            listOfVideos.push(video);
        } else {
            console.log("No se encontro un video con id: " + video);
        }
    }
    return listOfVideos;
}

async function getAllVideosWithAddedUrls(videos){
    return await addUrlsToVideos(videos);
}

async function postVideoToMedia(video){
    return await RequestManager.generatePost(VIDEOS_URL, video);
}

async function postImageToMedia(image){
    return await RequestManager.generatePost(IMAGES_URL, image);
}

async function changeProfileImage(img_id, img_url, img_uuid){
    const imageLinkWithId = IMAGES_URL + "/" + img_id;
    const data = {
        url: img_url,
        uuid: img_uuid
    }
    return await RequestManager.generatePutRequest(imageLinkWithId, data);
}


const VideoRequestManager = {}
VideoRequestManager.addUrlsToVideos = addUrlsToVideos;
VideoRequestManager.getImageById = getImageById;
VideoRequestManager.getVideoById = getVideoById
VideoRequestManager.getAllVideosFromMedia = getAllVideosFromMedia;
VideoRequestManager.getAllImagesFromMedia = getAllImagesFromMedia;
VideoRequestManager.getAllVideosWithAddedUrls = getAllVideosWithAddedUrls;
VideoRequestManager.postVideoToMedia = postVideoToMedia;
VideoRequestManager.postImageToMedia = postImageToMedia;
VideoRequestManager.changeProfileImage = changeProfileImage;

module.exports = VideoRequestManager;