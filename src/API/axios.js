import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://us-central1-productly-80dfc.cloudfunctions.net/api'//'http://localhost:5001/productly-80dfc/us-central1/api',
});

export default instance;