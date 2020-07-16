const RequestManager = require("../Managers/ExternalManagers/RequestsManager")
const LoginManager = require("../Managers/LoginManager")

const server_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ4NTM0MzIsIm5iZiI6MTU5NDg1MzQz" +
    "MiwianRpIjoiZWMwYWIxZWMtNmIxNS00NGNjLWE0ZTItNWI4ZWE1OTZjOTZkIiwiaWRlbnRpdHkiOiJodHRwczovL2Nob" +
    "3R1dmUtYXBwbGljYXRpb24tc2VydmVyLmhlcm9rdWFwcC5jb20vIiwidHlwZSI6InJlZnJl" +
    "c2giLCJ1c2VyX2NsYWltcyI6eyJzZXJ2ZXIiOnRydWV9fQ.klLra18fVSmrwKhENMGiLskZ5z2a8pRLEymBDZmVwnw";

const AUTHORIZE_URL = "https://chotuve-auth-server-g5-dev.herokuapp.com/authorize";

async function authorize(sl_token){
    const header = {
        'Content-Type': 'application/json',
        'Authorization': sl_token,
        'App-Server-Api-Key': server_token
    }

    const result = await RequestManager.getResponseByLinkWithHeader(AUTHORIZE_URL, header);
    return (result.status === 200);
}

module.exports = async (req, res, next) => {
    try {
        const sl_token = req.headers["sl-token"];
        const refresh_token = req.headers["refresh-token"];

        if (sl_token && !refresh_token) {
            const authorized = await authorize(sl_token);
            console.log("Imprimo sl_token de validacion:" + sl_token);
            if (!authorized) {
                console.log("NO AUTORIZADO");
                res.status(401).send("Invalid request.");
            } else {
                console.log("AUTORIZADO");
                next();
            }
        } else if (sl_token && refresh_token) {
            try {
                console.log("Asked for Refresh token")
                console.log(refresh_token);
                const Sl_Token = await LoginManager.getNewSLToken(refresh_token, server_token);
                console.log("NEW SL_TOKEN: " + sl_token);
                res.locals.sl_token = Sl_Token;
                next();
            } catch {
                res.status(401).send("Invalid request in relogin, probably refresh token missing");
            }
        } else {
            res.status(500).send("Unknown error");
        }
    } catch {
        res.status(401).json({
            error: new Error('Si estas viendo esto, Houston, tenemos un problema! (auth)')
        });
    }
};