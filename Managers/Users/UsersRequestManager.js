const RequestManager = require("../ExternalManagers/RequestsManager")
const USERS_URL = "https://chotuve-auth-server-g5-dev.herokuapp.com/users";
const server_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTQ4NTM0MzIsIm5iZiI6MTU5NDg1MzQz" +
    "MiwianRpIjoiZWMwYWIxZWMtNmIxNS00NGNjLWE0ZTItNWI4ZWE1OTZjOTZkIiwiaWRlbnRpdHkiOiJodHRwczovL2Nob" +
    "3R1dmUtYXBwbGljYXRpb24tc2VydmVyLmhlcm9rdWFwcC5jb20vIiwidHlwZSI6InJlZnJl" +
    "c2giLCJ1c2VyX2NsYWltcyI6eyJzZXJ2ZXIiOnRydWV9fQ.klLra18fVSmrwKhENMGiLskZ5z2a8pRLEymBDZmVwnw";

const header_with_server_key = {
    "App-Server-Api-Key" : server_token
}

class UsersRequestManager {
    async getAllUsersFromAuthServer() {
        const response = await RequestManager.getResponseByLinkWithHeader(USERS_URL, header_with_server_key);
        return response.data;
    }

    async getUserFromAuthById(id) {
        const str = "/" + id;
        const link = USERS_URL + str;
        const res = await RequestManager.getResponseByLinkWithHeader(link, header_with_server_key);
        if (res) {
            return await res.data;
        } else {
            return null;
        }
    }

    async getElementByIdFromArray(array, id) {
        return array.find(element => element.id === id);
    }


    async getUserByEmail(email) {
        const URL = USERS_URL + "/" + email;
        const result = await RequestManager.getResponseByLinkWithHeader(URL, header_with_server_key);

        if (result) {
            return result.data;
        } else {
            return null;
        }
    }

    async addDataToUser(userToModify, image) {
        const id = userToModify.id;
        const userFromAuth = await this.getUserFromAuthById(id);
        //No me importa si no se encontro la imagen porque puede que el usuario no tenga foto.
        if (userToModify) {
            userToModify.name = userFromAuth.display_name;
            userToModify.email = userFromAuth.email;
            userToModify.phone = userFromAuth.phone_number;
            userToModify.sign_in_method = userFromAuth.sign_in_method;
            if (image) {
                userToModify.img_url = image.url;
                userToModify.img_uuid = image.uuid;
            }
            return userToModify
        } else {
            return null;
        }
    }

    async addDataToUsers(usersFromAppServer, images) {
        const usersToReturn = [];
        for (let userFromAppServer of usersFromAppServer) {
            const image = await this.getElementByIdFromArray(images, userFromAppServer.img_id);
            if (image) {
                usersFromAppServer = await this.addDataToUser(userFromAppServer, image);
                if (userFromAppServer) {
                    usersToReturn.push(userFromAppServer);
                }
            }
        }
        return usersToReturn;
    }

    async postUserToAuth(user) {
        return await RequestManager.generatePostWithHeaders(USERS_URL, user, header_with_server_key);
    }

    async deleteUserFromAuth(id) {
        return await RequestManager.deleteByIdWithHeader(USERS_URL, id, header_with_server_key);
    }

    async modifyUser(id, data){
        const link = USERS_URL + "/" + id;
        return await RequestManager.generatePutRequestWithHeaders(link, data, header_with_server_key);
    }

    async addDisplayNameToElements(allElements){
        const allUsersFromAuth = await this.getAllUsersFromAuthServer();
        for (let actualElement of allElements){
            const user_id = actualElement.author_id;
            const actualUser = await allUsersFromAuth.find(actualUser => actualUser.id === user_id);
            actualElement.author_name = actualUser.display_name;        //nombre del usuario desde auth
        }
        return allElements;
    }

    async addDisplayNameToElementById(id, element){
        const userFromAuth = await this.getUserFromAuthById(id);
        element.author_name = userFromAuth.display_name;
        return element;
    }
}

const usersRequestManager = new UsersRequestManager();
module.exports = usersRequestManager;