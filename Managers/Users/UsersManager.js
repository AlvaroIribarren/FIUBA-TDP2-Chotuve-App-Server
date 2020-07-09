const Manager = require('../DBManager')
const UsersRequestManager = require("./UsersRequestManager")
const MediaRequestManager = require("../Videos/MediaRequestManager")
const {v4: uuidv4} = require('uuid');
const Joi = require('joi')

const DEFAULT_IMAGE = "https://firebasestorage.googleapis.com/v0/b/chotuve-467b2.appspot.com/o/images%2Fplaceholder.png?alt=media&token=8c10759b-43bc-4b29-8c3e-73049771036f";

const users = 'users';
const minNameLength = 3;
const MS_TO_DAYS_FACTOR = 86400000;
const MAX_DAYS_WITHOUT_CONNECTION_BEING_ACTIVE = 3;

async function fromMsToDays(date){
    return Math.round(date/MS_TO_DAYS_FACTOR);
}

class UsersManager {
    async getUsers() {
        const usersFromAppServer = await Manager.getRows(users);
        const imagesFromMediaServer = await MediaRequestManager.getAllImagesFromMedia();
        if (usersFromAppServer && imagesFromMediaServer) {
            return await UsersRequestManager.addDataToUsers(usersFromAppServer, imagesFromMediaServer);
        } else {
            return null;
        }
    }

    async updateLastLogin(user_id){
        console.log("Updating last login");
        return await Manager.updateRowWithNewValue(user_id, users, ' last_login ', ' DEFAULT ');
    }

    async getActiveUsers() {
        let date = Date.now();
        const users = await this.getUsersFromDB();
        const active_users = [];

        for (let user of users){
            const dif = date - user.last_login;
            const difInDays = await fromMsToDays(dif);

            if (difInDays <= MAX_DAYS_WITHOUT_CONNECTION_BEING_ACTIVE) {
                user = await UsersRequestManager.addDataToUser(user, null);
                active_users.push(user);
            }
        }
        return active_users;
    }

    async getUsersFromDB(){
        return await Manager.getRows(users);
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
        if (userFromAppSv) {
            const id_from_media = userFromAppSv.img_id;
            const image = await MediaRequestManager.getImageById(id_from_media);
            return await UsersRequestManager.addDataToUser(userFromAppSv, image);
        } else {
            console.log("User from app server is null");
        }
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
        const sign_in_method = data.sign_in_method;

        let phone;
        if (data.phone)
            phone = data.phone;

        if (data.img_url && data.img_uuid) {
            const img_url = data.img_url;
            const img_uuid = data.img_uuid;
            const resultFromMedia = await MediaRequestManager.postImageToMedia({url: img_url, uuid: img_uuid});
            img_id = resultFromMedia.id;
        } else {
            const img_url = DEFAULT_IMAGE;
            const img_uuid = uuidv4();
            console.log("uuid: " + img_uuid);
            const resultFromMedia = await MediaRequestManager.postImageToMedia({url: img_url, uuid: img_uuid});
            img_id = resultFromMedia.id;
        }
        const firebase_token = data.firebase_token;

        const userToAuth = {display_name: name, email, phone_number: phone, sign_in_method, firebase_token};
        const resultFromAuth = await UsersRequestManager.postUserToAuth(userToAuth);
        if (resultFromAuth) {
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
        } else {
            console.log("Negative result from auth server");
            return null;
        }
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

    async changeProfilePicture(user_id, img_id, newImgUrl, newImgUuid) {
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