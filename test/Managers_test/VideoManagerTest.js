const assert = require('chai').assert;
const VideoManager = require("../../Managers/Videos/VideosManager")

let video;
let video_id;
const data = {
    "author_id": 23,
    "title" : "a",
    "description" : "b",
    "location" : "c",
    "public_video" : true,
    "video_size": "10,5",
    "url": "test,com",
    "uuid": "testtest"
}

describe('Videos test', async function(){
    this.timeout(30000);
    it('Add video', async () => {
        const length1 = await VideoManager.getAmountOfVideos();
        video_id = await VideoManager.postVideo(data, null);
        const length2 = await VideoManager.getAmountOfVideos();

        assert.equal(length1+1, length2);
    });

    it('Check video s existance', async ()=>{
        video = await VideoManager.getVideoByIdInAppServer(video_id);
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

    it('Delete video', async () =>{
        const length1 = await VideoManager.getAmountOfVideos();
        await VideoManager.deleteVideoByVideosId(video_id);
        const length2 = await VideoManager.getAmountOfVideos();
        assert.equal(length1-1, length2);
    })
});