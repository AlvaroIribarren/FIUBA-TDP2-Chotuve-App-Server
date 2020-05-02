var admin = require("firebase-admin")

var serviceAccount = require("./chotuve-467b2-firebase-adminsdk-zuv00-3f7d5ddb2e.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "postgres://xovbegcheqegut:13cd6d27773e4f49fbbc6fb4677a84d3b92f9c0093793238f468eab55e32186e@ec2-52-6-143-153.compute-1.amazonaws.com:5432/d6o8g7k6f"
});

let payload = {
    notification: {
        title: "This is a Notification",
        body: "This is the body of the notification message."
    }
};

let options = {
    priority: "high",
    timeToLive: 60 * 60 *24
};

admin.messaging().sendToDevice(registrationToken, payload, options)
    .then(function(response) {
        console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
        console.log("Error sending message:", error);
    });
