const assert = require('chai').assert;
const Manager = require("../../Managers/DBManager")
const VideoManager = require("../../Managers/Videos/VideosManager")

const user = {
    id: 1,
    name: "AlvarinTest"
}
let video;
const title = "a";
const description = "b";
const location = "c";
const public_video = true;
const video_id = 1;

describe('Videos test', async function(){
    this.timeout(15000);
    it('Add video', async () => {
        const length1 = await VideoManager.getAmountOfVideos();
        await VideoManager.insertVideo(video_id, user.id, user.name, title, description, location, public_video);
        const length2 = await VideoManager.getAmountOfVideos();

        assert.equal(length1+1, length2);
    });

    it('Check video s existance', async ()=>{
        video = await VideoManager.getVideoByIdInAppServer(video_id);
        assert.notEqual(video, null);
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
        assert.equal(video.id, video_id);
        assert.equal(video.author_id, user.id);
        assert.equal(video.author_name, user.name);
        assert.equal(video.title, title);
        assert.equal(video.description, description);
        assert.equal(video.location, location);
        assert.equal(video.public_video, public_video);
    });

    it('Delete video', async () =>{
        const length1 = await VideoManager.getAmountOfVideos();
        await Manager.deleteRowFromTableById(video_id, 'videos');
        const length2 = await VideoManager.getAmountOfVideos();
        assert.equal(length1-1, length2);
    })
});