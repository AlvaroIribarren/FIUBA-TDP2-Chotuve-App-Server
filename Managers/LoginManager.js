const RequestManager = require("./ExternalManagers/RequestsManager")

const LOGIN_LINK = "https://chotuve-auth-server-g5-dev.herokuapp.com/login";

async function getTokensFromCreatedUser(firebase_token){
    const data = {firebase_token};
    const result = await RequestManager.generatePost(LOGIN_LINK, data);
    const sl_token = result.token;
    const refresh_token = result.refresh_token;
    return {sl_token, refresh_token};
}

async function getNewSLToken(refresh_token){
    const header = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + refresh_token
        }
    }
    const result = await RequestManager.getResponseByLinkWithHeader(LOGIN_LINK, header);
    const sl_token = await result.token;
    return sl_token;
}


const LoginManager = {}
LoginManager.getTokensFromCreatedUser = getTokensFromCreatedUser;
LoginManager.getNewSLToken = getNewSLToken;

module.exports = LoginManager;