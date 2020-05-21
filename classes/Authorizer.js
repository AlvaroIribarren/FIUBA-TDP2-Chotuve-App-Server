const RequestManager = require("../Managers/ExternalManagers/RequestsManager")
const AUTHORIZE_URL = "https://chotuve-auth-server-g5-dev.herokuapp.com/authorizer";

const VALID_STATUS = 200;

class Authorizer {
    async authorizeRequest(token){
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }
        const result = await RequestManager.getResponseByLinkWithHeader(AUTHORIZE_URL, header);
        const status = result.status;
        return status === VALID_STATUS;
    }
}

const auth = new Authorizer();
module.exports = auth;