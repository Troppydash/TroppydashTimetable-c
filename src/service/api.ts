import axios from 'axios';

export default axios.create({
    baseURL: process.env.API_ENDPOINT || "http://localhost:5000/time-table-8c06b/us-central1/api"
})
