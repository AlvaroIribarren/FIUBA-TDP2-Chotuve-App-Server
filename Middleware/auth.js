const RequestManager = require("../Managers/ExternalManagers/RequestsManager")

const AUTHORIZER_URL = "https://chotuve-auth-server-g5-dev.herokuapp.com/authorizer";

async function authorize(sl_token){
    const header = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sl_token
        }
    }
    const result = await RequestManager.getResponseByLinkWithHeader(AUTHORIZER_URL, header);
    const status = result.status;
    return (status === 200);
}

module.exports = async (req, res, next) => {
    try {
        const sl_token = req.headers.sl_token;
        const authorized = await authorize(sl_token);
        console.log("Imprimo sl_token de validacion:" + sl_token);
        if (!authorized) {
            res.status(401).send("Invalid request.");
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};