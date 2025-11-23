import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

function ApiClient() {
    if (!process.env.API_BASE_URL) {
        console.debug('API_BASE_URL is not defined in environment variables.');
    }
    return axios.create({
      baseURL: process.env.API_BASE_URL,
      timeout: 10000,
        headers: {
        'Content-Type': 'application/json',
      },
    });
}


export const apiClient = ApiClient();