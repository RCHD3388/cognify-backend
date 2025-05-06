const axios = require("axios")

class ApiService {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.axiosInstance = axios.create({
            baseURL: baseURL,
            timeout: 10000, 
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    getInstance(){
        return this.axiosInstance;
    }
}

module.exports = ApiService;