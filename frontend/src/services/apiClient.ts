import axios from 'axios';
import type { AxiosInstance } from 'axios';

function createApiClient(): AxiosInstance {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    
    if (!baseURL) {
        console.warn('API_BASE_URL is not defined in environment variables.');
    }
    
    return axios.create({
        baseURL: baseURL,
        timeout: parseInt('3600000'),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export const apiClient = createApiClient();