const assert = require('chai').assert;
const VideoManager = require("../../Managers/Videos/VideosManager")

let video;
let video_id;
const author_id = 26;
const data = {
    "author_id": author_id,
    "title" : "testing",
    "description" : "b",
    "location" : "c",
    "public_video" : true,
    "video_size": "10,5",
    "url": "test,com",
    "uuid": "testtest"
}

const data1 = {
    "author_id": author_id,
    "title" : "testing1",
    "description" : "b1",
    "location" : "c1",
    "public_video" : true,
    "video_size": "10,51",
    "url": "test,com1",
    "uuid": "testtest1"
}

describe('Videos test', async function(){
    this.timeout(30000);
    it('Add video', async ()=> {
        const length1 = await VideoManager.getAmountOfVideos();
        video_id = await VideoManager.postVideo(data, null);
        const length2 = await VideoManager.getAmountOfVideos();

        assert.equal(length1+1, length2);
    });

    it('Check video s existance', async ()=> {
        video = await VideoManager.getVideoByIdInAppServer(video_id);
        const result = await VideoManager.doesVideoExist(video_id);
        assert.isNotNull(result);
        assert.isNotNull(video);
    })

    it('Check id existance', async() =>{
        assert.property(video, 'id');
    })

    it('Check author_id existance', async() =>{
        assert.property(video, 'author_id');
    })

    it('Check author_name existance', async() =>{
        assert.property(video, 'author_name');
    })

    it('Check title existance', async() =>{
        assert.property(video, 'title');
    })

    it('Check description existance', async() =>{
        assert.property(video, 'description');
    })

    it('Check location existance', async() =>{
        assert.property(video, 'location');
    })

    it('Check public existance', async() =>{
        assert.property(video, 'public_video');
    })


    it('Check info', async ()=>{
        assert.equal(video.author_id, data.author_id);
        assert.equal(video.title, data.title);
        assert.equal(video.description, data.description);
        assert.equal(video.location, data.location);
        assert.equal(video.public_video, data.public_video);
    });

    it('Disable video disables video', async()=> {
        await VideoManager.disableVideo(video_id);
        let enabled = await VideoManager.isVideoEnabled(video_id);
        assert.isFalse(enabled);
    })

    it('Enable video enables video', async()=> {
        await VideoManager.enableVideo(video_id);
        let enabled = await VideoManager.isVideoEnabled(video_id);
        assert.isTrue(enabled);
    })

    it('Search video by title', async()=> {
        const allVideos = await VideoManager.getVideosInAppServer();
        const search = "testing";
        const filtratedVideos = await VideoManager.getSearchRelatedVideos(allVideos, search);
        assert(filtratedVideos.length > 0, 'Se encontro al menos un video');
    })

    it('Modify videos title', async() => {
        await VideoManager.modifiyVideo(video_id, 'title', 'tituloNuevo');
        video = await VideoManager.getVideoByIdInAppServer(video_id);
        assert.equal(video.title, 'tituloNuevo', 'Los titulos deberian ser iguales');
    })

    it('Search video by title', async()=> {
        const allVideos = await VideoManager.getVideosInAppServer();
        const search = "testing";
        const filtratedVideos = await VideoManager.getSearchRelatedVideos(allVideos, search);
        assert.equal(filtratedVideos.length, 0, 'Filtrated videos length is 0');
    })

    it('Add like to video', async() => {
        const oldViews = await VideoManager.getLikesFromVideo(video_id);
        await VideoManager.addLikeToVideo(video_id);
        const newViews = await VideoManager.getLikesFromVideo(video_id);
        assert.equal(oldViews+1, newViews, 'Adding one like');
    })

    it('Add like to video', async() => {
        const oldAmount = await VideoManager.getLikesFromVideo(video_id);
        await VideoManager.addLikeToVideo(video_id);
        const newAmount = await VideoManager.getLikesFromVideo(video_id);
        assert.equal(oldAmount+1, newAmount, 'Adding one like');
    })

    it('Add dislike to video', async() => {
        const oldAmount = await VideoManager.getDislikesFromVideo(video_id);
        await VideoManager.addDislikeToVideo(video_id);
        const newAmount = await VideoManager.getDislikesFromVideo(video_id);
        assert.equal(oldAmount+1, newAmount, 'Adding one dislike');
    })

    it('Sub like to video', async() => {
        const oldAmount = await VideoManager.getLikesFromVideo(video_id);
        await VideoManager.subLikeToVideo(video_id);
        const newAmount = await VideoManager.getLikesFromVideo(video_id);
        assert.equal(oldAmount, newAmount+1, 'Substracting one like');
    })

    it('Sub dislike to video', async() => {
        const oldAmount = await VideoManager.getDislikesFromVideo(video_id);
        await VideoManager.subDislikeToVideo(video_id);
        const newAmount = await VideoManager.getDislikesFromVideo(video_id);
        assert.equal(oldAmount, newAmount+1, 'Substracting one dislike');
    })

    it('Add positive reaction to video', async() => {
        const oldAmount = await VideoManager.getLikesFromVideo(video_id);
        await VideoManager.addReactionToVideo(video_id, true);
        const newAmount = await VideoManager.getLikesFromVideo(video_id);
        assert.equal(oldAmount+1, newAmount, 'Adding one like');
    })

    it('Add negative reaction to video', async() => {
        const oldAmount = await VideoManager.getDislikesFromVideo(video_id);
        await VideoManager.addReactionToVideo(video_id, false);
        const newAmount = await VideoManager.getDislikesFromVideo(video_id);
        assert.equal(oldAmount+1, newAmount, 'Adding one dislike');
    })

    it('Delete positive reaction to video', async() => {
        const oldAmount = await VideoManager.getLikesFromVideo(video_id);
        await VideoManager.deleteReactionFromVideo(video_id, true);
        const newAmount = await VideoManager.getLikesFromVideo(video_id);
        assert.equal(oldAmount, newAmount+1, 'Substracting one like');
    })

    it('Delete negative reaction to video', async() => {
        const oldAmount = await VideoManager.getDislikesFromVideo(video_id);
        await VideoManager.deleteReactionFromVideo(video_id, false);
        const newAmount = await VideoManager.getDislikesFromVideo(video_id);
        assert.equal(oldAmount, newAmount+1, 'Substracting one dislike');
    })

    it('Delete video', async () =>{
        const length1 = await VideoManager.getAmountOfVideos();
        await VideoManager.deleteVideoByVideosId(video_id);
        const length2 = await VideoManager.getAmountOfVideos();
        assert.equal(length1-1, length2);
    })

    it('Total amount of views', async()=>{
        const allVideos = await VideoManager.getVideosInAppServer();
        let acum = 0;
        for(let video of allVideos){
            acum += video.views;
        }
        const totalViews = await VideoManager.getTotalViews();
        assert.equal(acum, totalViews);
    })

    it('Deleting all videos from user', async() => {
        const oldAmount = await VideoManager.getAmountOfVideos();
        const oldAmountFromUser = await VideoManager.getAmountOfVideosFromUser(author_id, true);
        await VideoManager.postVideo(data, null);
        await VideoManager.postVideo(data1, null);
        const newAmount = await VideoManager.getAmountOfVideos();
        const newAmountFromUser = await VideoManager.getAmountOfVideosFromUser(author_id, true);

        assert.equal(oldAmount+2, newAmount, "2 videos added correctly");
        assert.equal(oldAmountFromUser+2, newAmountFromUser, "2 videos added correctly from user");

        await VideoManager.deleteAllVideosFromUser(author_id);
        const amountAfterDelete = await VideoManager.getAmountOfVideos()
        const amountFromUserAfterDelete = await VideoManager.getAmountOfVideosFromUser(author_id, true);
        assert.equal(oldAmount, amountAfterDelete, "Videos correctly deleted");
        assert.equal(oldAmountFromUser, amountFromUserAfterDelete, "Videos correctly deleted from user");
    })

    it('Getting videos with importance', async()=>{
        const allVideos = await VideoManager.getVideosWithImportance(author_id);
        for (let actualVideo of allVideos){
            assert.property(actualVideo, 'importance', 'Chequeo que se calcula la importancia');
        }
        const amountOfVideos = await VideoManager.getAmountOfVideos();
        assert.equal(allVideos.length, amountOfVideos, 'La cantidad de videos debería ser la misma d' +
            'e los que se calculan la importancia');
    })
});