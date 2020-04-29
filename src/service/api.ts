import axios from 'axios';

export default axios.create({
    baseURL: 'https://us-central1-time-table-8c06b.cloudfunctions.net/api'
})


//'https://us-central1-time-table-8c06b.cloudfunctions.net/api'
// "http://localhost:5000/time-table-8c06b/us-central1/api"
