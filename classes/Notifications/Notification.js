const TokenManager = require("../../Managers/TokensManager")
const Joi = require("joi")

class Notification {
    constructor(receiver_id, notification, data) {
        return (async () => {
            const response = await TokenManager.getTokenByUserId(receiver_id);
            const notificationError = this.validateNotificationInput().error;
            const dataError = this.validateDataInput().error;

            if (response && !notificationError && !dataError){
                this.to = response.token;
                this.notification = notification;
                this.data = data;
            } else {
                console.log("Error creating notification");
            }
            return this; // when done
        })();
    }

    async validateDataInput() {}

    async validateNotificationInput(body){
        const schema = {
            "title": Joi.string().required(),
            "body": Joi.string().required(),
            "click-action": Joi.string().required()
        }
        return Joi.validate(body, schema);
    }
}

module.exports = Notification;