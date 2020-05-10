const Notification = require("./Notification");
const Joi = require("joi");


class RequestNotification extends Notification{
    async validateDataInput(data){
        console.log("Request notification");
        const schema = {
            "sender_name": Joi.string().required()
        }
        return Joi.validate(data, schema);
    }
}

module.exports = RequestNotification;