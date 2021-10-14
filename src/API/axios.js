import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5001/productly-80dfc/us-central1/api',
});

export default instance;