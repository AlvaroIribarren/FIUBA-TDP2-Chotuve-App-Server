const nools = require("nools");

const startingDate = new Date("May 1, 2020 00:00:00");

async function getTimeInDays(date){
    const timeMs = date.getTime();
    const timeDays = timeMs/(1000*60*60*24);
    return timeDays;
}

const flow = nools.flow("Likes", function (flow) {
    flow.rule("Likes balance", {salience: 2}, [Object, "v", "v.likesBalanceFromFriends && v.views"], function (facts) {
        const actualVideo = facts.v;
        facts.v.importance += actualVideo.likesBalanceFromFriends/ actualVideo.views;
        console.log(facts.v.importance);
    });

    flow.rule("Comments", {salience: 2}, [Object, "v", "v.comments && v.views"], (facts) => {
        const actualVideo = facts.v;
        const commentsImportance = actualVideo.comments/ actualVideo.views;
        facts.v.importance += commentsImportance;
    })

    flow.rule("Author-Friends", {salience: 2}, [Object, "v", "v.author_friends && v.amountOfUsers"], (facts) => {
        const actualVideo = facts.v;
        const authorFriendsImportance = actualVideo.author_friends / actualVideo.amountOfUsers;
        facts.v.importance += authorFriendsImportance;
    });

    flow.rule("Views per total", {salience: 2}, [Object, "v", "v.views && v.totalAmountOfViews"], (facts) => {
        const actualVideo = facts.v;
        const viewsImportancePerTotal = actualVideo.views / actualVideo.totalAmountOfViews;
        facts.v.importance += viewsImportancePerTotal;
    })

    flow.rule("Is author a friend", {salience: 2}, [Object, "v", "v.isAuthorAFriend"], (facts) => {
        facts.v.importance += 1;
    })

    flow.rule("Videos date", {salience: 2}, [Object, "v", "v.upload_date"], async (facts) => {
        let date = facts.v.upload_date;
        const dateDays = date.getTime();
        const startingDateMs = startingDate.getTime();
        let difference = (dateDays - startingDateMs)/ startingDateMs;
        facts.v.importance += difference;
    })

    flow.rule("Normalize importance", {salience: 1}, [Object, "v", "v"], (facts) => {
        const amountOfRules = flow.__rules.length;
        facts.v.importance = facts.v.importance / amountOfRules;
    })
});

async function getImportanceOnVideos(requester_id, videos){
    const session = flow.getSession();

    for (let video of videos){
        session.assert(video);
    }

    await session.match();
    const videosFinal = session.getFacts();

    console.log(videosFinal);
    return videosFinal;
}

const RulesEngine = {};
RulesEngine.getImportanceOnVideos = getImportanceOnVideos;
module.exports = RulesEngine;

