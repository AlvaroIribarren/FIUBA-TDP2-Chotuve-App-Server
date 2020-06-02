const Manager = require('../DBManager')
const UsersRequestManager = require("./UsersRequestManager")
const MediaRequestManager = require("../Videos/MediaRequestManager")
const Joi = require('joi')

const users = 'users';
const minNameLength = 3;

class UsersManager {
    async getUsers() {
        const usersFromAppServer = await Manager.getRows(users);
        const imagesFromMediaServer = await MediaRequestManager.getAllImagesFromMedia();
        if (usersFromAppServer) {
            return await UsersRequestManager.addDataToUsers(usersFromAppServer, imagesFromMediaServer);
        } else {
            return null;
        }
    }

    async getAmountOfUsers(){
        const allUsers = await Manager.getRows(users);
        return allUsers.length;
    }

    async doesUserExist(id){
        return await Manager.getIdFromTable(id, users);
    }

    async getUserById(id) {
        const userFromAppSv = await Manager.getIdFromTable(id, users);
        const id_from_media = userFromAppSv.img_id;
        const image = await MediaRequestManager.getImageById(id_from_media);
        return await UsersRequestManager.addDataToUser(userFromAppSv, image);
    }

    async getUserByEmail(email) {
        return await UsersRequestManager.getUserByEmail(email);
    }

    async insertUser(id, img_id) {
        console.log("Insertando elemento en: " + users);
        const text = 'INSERT INTO users(id, img_id) VALUES($1, $2)';
        const values = [id, img_id];
        await Manager.executeQueryInTable(text, values);
    }

//todo: mandar firebase_token a Auth
    async postUser(data, res) {
        let img_id = 0;
        const name = data.name;
        const email = data.email;
        const phone = data.phone;
        const sign_in_method = data.sign_in_method;
        const img_url = data.img_url;
        const img_uuid = data.img_uuid;
        if (img_url && img_uuid) {
            const resultFromMedia = await MediaRequestManager.postImageToMedia({url: img_url, uuid: img_uuid});
            img_id = resultFromMedia.id;
        }
        const firebase_token = data.firebase_token;
        const userToAuth = {display_name: name, email, phone_number: phone, sign_in_method, firebase_token};
        const resultFromAuth = await UsersRequestManager.postUserToAuth(userToAuth);
        const id = resultFromAuth.id;
        const refresh_token = resultFromAuth.refresh_token;
        const sl_token = resultFromAuth.token;
        await this.insertUser(id, img_id);
        //testing purposes.
        if (res !== null) {
            console.log({refresh_token, sl_token});
            res.status(201).send({id, refresh_token, sl_token});
        }
        return id;
    }

    async deleteUserById(id) {
        const user = await this.getUserById(id);
        if (user) {
            await Manager.deleteRowFromTableById(id, users);
            return await UsersRequestManager.deleteUserFromAuth(id);
        } else {
            return null;
        }
    }

//todo: put a auth
    async editUser(id, data) {
        try {
            return await UsersRequestManager.modifyUser(id, data);
        } catch (e) {
            console.log(e);
        }
    }

    async getNameById(user_id) {
        const user = await this.getUserById(user_id);
        return user.name;
    }

    async changeProfilePicture(user_id, newImgUrl, newImgUuid) {
        const user = await this.getUserById(user_id);
        const img_id = user.img_id;
        return await MediaRequestManager.changeProfileImage(img_id, newImgUrl, newImgUuid);
    }

    async checkCorrectIdAndName(author_id, author_name) {
        const user = await this.getUserById(author_id);
        if (user) {
            const name = user.name;
            return author_name === name;
        } else {
            return false;
        }
    }

    async validateUser(body) {
        const schema = {
            name: Joi.string().min(minNameLength).required(),
            email: Joi.string().required(),
            phone: Joi.string(),
            sign_in_method: Joi.string().required(),
            img_url: Joi.string(),
            img_uuid: Joi.string(),
            firebase_token: Joi.string().required()
        }
        return Joi.validate(body, schema);
    }

    async validateImageModification(body) {
        const schema = {
            img_url: Joi.string().required(),
            img_uuid: Joi.string().required()
        }
        return Joi.validate(body, schema);
    }

    async validateProfileModification(body) {
        const schema = {
            name: Joi.string().min(minNameLength).required(),
            email: Joi.string().required(),
            phone: Joi.string().required()
        }
        return Joi.validate(body, schema);
    }
}

const usersManager = new UsersManager();
module.exports = usersManager;