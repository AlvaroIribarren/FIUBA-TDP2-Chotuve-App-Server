const Manager = require("./DBManager")
const RequestManager = require("./ExternalManagers/RequestsManager")

const LOGIN_LINK = "https://chotuve-auth-server-g5-dev.herokuapp.com/login";

async function login(firebase_token){
    const data = {firebase_token};
    const result = await RequestManager.getResponseWithBody(LOGIN_LINK, data);
    const token = result.token;
    const refresh_token = result.refresh_token;
    return {token, refresh_token};
}


const LoginManager = {}
LoginManager.login = login;

module.exports = LoginManager;