import axios from 'axios';
import type { AxiosInstance } from 'axios';

function createApiClient(): AxiosInstance {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    
    if (!baseURL) {
        console.warn('API_BASE_URL is not defined in environment variables.');
    }
    
    const client = axios.create({
        baseURL: baseURL,
        timeout: 360000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Interceptor para adicionar token automaticamente
    client.interceptors.request.use((config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Interceptor para tratar token expirado
    client.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                // Token expirou ou é inválido
                localStorage.removeItem('authToken');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
    return client;
}

export const apiClient = createApiClient();