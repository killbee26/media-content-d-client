require('dotenv').config();
import axios from 'axios';

console.log("BASE_URL: ",process.env.NEXT_PUBLIC_BASE_URL);

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;