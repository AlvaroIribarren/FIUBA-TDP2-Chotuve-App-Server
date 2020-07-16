const axios = require('axios');

class MediaManager {
    async generatePostWithHeaders(link, data, headers){
        let response = null;
        let axiosHeaders = {
            headers: headers
        };

        try {
            await axios.post(link, data, axiosHeaders)
                .then((res) => {
                    response = res;
                })
                .catch((err) => {
                });
        } catch (error){
            console.log(error);
        }
        return response;
    }

    async generatePost(link, data) {
        return this.generatePostWithHeaders(link, data, null);
    }

    async getResponseByLink(link) {
        let response;
        try {
            response = await axios.get(link);
        } catch (error) {
            console.error(error);
        }
        return response;
    }

    async getResponseByLinkWithHeader(link, headers) {
        let response;
        let axiosHeaders = {
            headers: headers
        }
        try {
            response = await axios.get(link, axiosHeaders);
        } catch (error) {
            response = error.response;
        }
        return response;
    }

    async getResponseWithBody(link, data) {
        let res;
        try {
            await axios.get(link, data)
                .then((response) => {
                    res = response.data;
                })
                .catch((error) => {
                    console.log(error);
                })
            return res;
        } catch (error) {

        }
    }

    async generatePutRequest(link, data) {
        try {
            let res = null;
            await axios.put(link, data)
                .then((response) => {
                    res = response.data;
                })
                .catch((error) => {
                    console.log(error);
                })
            return res;
        } catch (e) {
            console.log("Error: " + e);
        }
    }

    async deleteById(link, id) {
        const modifiedLink = link + "/" + id;
        let response;
        try {
            response = await axios.delete(modifiedLink);
        } catch (error) {
            console.error(error);
        }
        return response;
    }
}

module.exports = new MediaManager();