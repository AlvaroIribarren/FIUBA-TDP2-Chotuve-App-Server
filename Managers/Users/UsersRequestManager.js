const RequestManager = require("../ExternalManagers/RequestsManager")
const USERS_URL = "https://chotuve-auth-server-g5-dev.herokuapp.com/users"

class UsersRequestManager {

    async getAllUsersFromAuthServer() {
        const response = await RequestManager.getResponseByLink(USERS_URL);
        return response.data;
    }

    async getUserFromAuthById(id) {
        const str = "/" + id;
        const link = USERS_URL + str;
        const res = await RequestManager.getResponseByLink(link);
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
        const result = await RequestManager.getResponseByLink(URL);

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
            userToModify.img_url = image.url;
            userToModify.img_uuid = image.uuid;
            return userToModify
        } else {
            return null;
        }
    }

    async addDataToUsers(usersFromAppServer, images) {
        const usersToReturn = [];
        for (let userFromAppServer of usersFromAppServer) {
            const image = await this.getElementByIdFromArray(images, userFromAppServer.img_id);
            usersFromAppServer = await this.addDataToUser(userFromAppServer, image);
            if (userFromAppServer) {
                usersToReturn.push(userFromAppServer);
            }
        }
        return usersToReturn;
    }

    async postUserToAuth(user) {
        return await RequestManager.generatePost(USERS_URL, user);
    }

    async deleteUserFromAuth(id) {
        return await RequestManager.deleteById(USERS_URL, id);
    }

    async modifyUser(id, data){
        const link = USERS_URL + "/" + id;
        return await RequestManager.generatePutRequest(link, data);
    }
}

const usersRequestManager = new UsersRequestManager();
module.exports = usersRequestManager;