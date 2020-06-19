const axios = require('axios');

async function generatePost(link, data){
    let response = null;
    try {
        await axios.post(link, data)
            .then(function (res) {
                response = res.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
    }
    return response;
}

async function getResponseByLink(link){
    let response;
    try {
        response = await axios.get(link);
    } catch (error) {
        console.error(error);
    }
    return response;
}

async function getResponseByLinkWithHeader(link, header){
    let response;
    try {
        response = await axios.get(link, header);
    } catch (error) {
        response = error.response;
    }
    return response;
}

async function getResponseWithBody(link, data){
    let res;
    try {
        await axios.get(link, data)
            .then((response) => {
                res = response.data;
            })
            .catch((error) => {
                console.log(error);
            })
        return res;
    } catch (error) {

    }
}

async function generatePutRequest(link, data){
    try {
        let res = null;
        await axios.put(link, data)
            .then((response) => {
                res = response.data;
            })
            .catch((error) => {
                console.log(error);
            })
        return res;
    } catch(e){
        console.log("Error: " + e);
    }
}

async function deleteById(link, id){
    const modifiedLink = link + "/" + id;
    let response;
    try {
        response = await axios.delete(modifiedLink);
    } catch (error) {
        console.error(error);
    }
    return response;
}

MediaManager = {};
MediaManager.getResponseByLinkWithHeader = getResponseByLinkWithHeader;
MediaManager.getResponseWithBody = getResponseWithBody;
MediaManager.generatePutRequest = generatePutRequest;
MediaManager.getResponseByLink = getResponseByLink;
MediaManager.generatePost = generatePost;
MediaManager.deleteById = deleteById;

module.exports = MediaManager;