const axios = require('axios');

async function generatePost(link, json){
    let response = null;
    await axios.post(link, json)
        .then(function (res) {
            response = res.data.id;
        })
        .catch(function (error) {
            console.log(error);
        });
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

MediaManager = {};
MediaManager.getResponseByLink = getResponseByLink;
MediaManager.generatePost = generatePost;

module.exports = MediaManager;