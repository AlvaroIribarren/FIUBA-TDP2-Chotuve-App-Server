const Notification = require("./Notification")
const Joi = require("joi")

class FriendNotification extends Notification{
    async validateDataInput(data){
        const schema = {
            "acceptors_name": Joi.string().required(),
        }
        return Joi.validate(data, schema);
    }
}

module.exports = FriendNotification;