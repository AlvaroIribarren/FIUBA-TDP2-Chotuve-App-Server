const RequestManager = require("./ExternalManagers/RequestsManager")
const UserRequestManager = require("./Users/UsersRequestManager");
const LOGIN_LINK = "https://chotuve-auth-server-g5-dev.herokuapp.com/login";
const AUTHENTICATE_URL = "https://chotuve-auth-server-g5-dev.herokuapp.com/authenticate";

class LoginManager {
    async getTokensFromCreatedUser(headers) {
        const result = await RequestManager.generatePostWithHeaders(LOGIN_LINK, null, headers);
        if (result){
            const sl_token = result.data.token;
            const refresh_token = result.data.refresh_token;
            return {sl_token, refresh_token};
        } else {
            console.log("Null response from post to /login in auth");
        }
    }

    async getNewSLToken(refresh_token, server_token) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': refresh_token,
            'App-Server-Api-Key': server_token
        }
        const result = await RequestManager.getResponseByLinkWithHeader(AUTHENTICATE_URL, headers);
        return await result.data.token;     //short lived token
    }
}

const loginManager = new LoginManager();
module.exports = loginManager;