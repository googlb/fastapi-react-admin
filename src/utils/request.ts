import axios from 'axios';

const service = axios.create({
    baseURL: '/api/v1', // Matches backend prefix
    timeout: 5000,
});

// Request interceptor
service.interceptors.request.use(
    (config) => {
        // TODO: Add token to headers
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        // Assuming backend returns { code: 200, data: ..., message: ... }
        // Adjust based on actual backend response structure
        return res;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

export default service;
