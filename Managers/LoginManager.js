const RequestManager = require("./ExternalManagers/RequestsManager")

const LOGIN_LINK = "https://chotuve-auth-server-g5-dev.herokuapp.com/login";

class LoginManager {

    async getTokensFromCreatedUser(firebase_token) {
        const data = {firebase_token};
        const result = await RequestManager.generatePost(LOGIN_LINK, data);
        console.log("Got message from post to login");
        console.log(result);
        const id = 18;
        const sl_token = result.token;
        const refresh_token = result.refresh_token;
        return {id, sl_token, refresh_token};
    }

    async getNewSLToken(refresh_token) {
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': refresh_token
            }
        }
        const result = await RequestManager.getResponseByLinkWithHeader(LOGIN_LINK, header);
        const sl_token = await result.data.token;
        return sl_token;
    }
}

const loginManager = new LoginManager();
module.exports = loginManager;