import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_FIREBASE_FUNCTIONS_API_KEY_LOCAL,//'https://us-central1-productly-61da0.cloudfunctions.net/api'//'http://localhost:5001/productly-80dfc/us-central1/api',
});

export default api;