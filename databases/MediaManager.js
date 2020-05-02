const axios = require('axios');

async function generatePost(link, json){
    let response;
    axios.post(link, json)
        .then(res => {
            response = res;
            console.log('Res: ' + res);
        })
        .catch(error => {
            console.error(error);
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