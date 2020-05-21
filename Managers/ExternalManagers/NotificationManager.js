const Manager = require('../DBManager')
const AxiosManager = require("./RequestsManager")
const axios = require("axios")

const communicator = 'communicator';
const link = "https://fcm.googleapis.com/fcm/send";
const key = 'key=AAAAh7BTywg:APA91bFFr4C3-YD7rY1TA5hu8Xs-S7Xy1rBfaecw5EwWZJYohJEXuspPT1CKU111BkKlNQLHIfeUb1Bo1vyPhBjYA4Jm7eQsSDEsACLHAP_q5C1hPcXCTnuQ59ocSdJMJnYAqZs9qlVd';

const Notification = require("../../classes/Notifications/Notification")

async function sendNotification(notification){
    return await postNotification(notification);
}

async function postNotification(notification){
    try {
        let res = null;
        await axios.post(link, notification, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': key
            },
        })
            .then((response) => {
                res = response.data;
            })
            .catch((error) => {
                console.log(error);
            })
        return res;
    } catch(e){
        console.log("Error: " + e);
    }
}


const NotificationManager = {}
NotificationManager.sendNotification = sendNotification;

module.exports = NotificationManager;