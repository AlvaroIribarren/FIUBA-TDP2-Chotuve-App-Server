const Manager = require('./DBManager')
const AxiosManager = require("./AxiosManager")
const axios = require("axios")

const communicator = 'communicator';
const link = "https://fcm.googleapis.com/fcm/send";
const key = 'key=AAAAh7BTywg:APA91bFFr4C3-YD7rY1TA5hu8Xs-S7Xy1rBfaecw5EwWZJYohJEXuspPT1CKU111BkKlNQLHIfeUb1Bo1vyPhBjYA4Jm7eQsSDEsACLHAP_q5C1hPcXCTnuQ59ocSdJMJnYAqZs9qlVd';

const headers = {
    'Authorization': key,
    'Content-Type': 'application/json'
}


async function getVideos(){
    try {
        return await AxiosManager.getResponseByLink(link);
    } catch(e){
        console.log(e);
    }
}

async function postMessage(){
    try {
        const json = {
            "to": "eh863Q-dTQuJgxnqJbPJe4:APA91bHmJO-emkwpwTJ_J05DVxUN9hn5LUBFE7nd0DYFLHmhOYNRsazT4hspn8TLCkWS3Q_RLWBH0H-7H7GeUQJhhRFNuBdd4TF0np8iHjgwA1l69iyV3ZCNI2dBnY7y4sTryIEoUkrH",
            "notification": {
            "title": "TUMANDO EL CLUB REMIX 3.0",
                "body": "AGUANTE EL NEO",
                "click-action": "message"
             },
            "data": {
            "asdasd": "Alvarin",
                "message": "Que onda",
                "time": "3:50pm"
            }
        }

        console.log("Enviando mensaje");
        await axios.post(link, json, headers);
    } catch(e){

    }
}


const FirebaseCommunicator = {}
FirebaseCommunicator.postMessage = postMessage;


module.exports = FirebaseCommunicator;