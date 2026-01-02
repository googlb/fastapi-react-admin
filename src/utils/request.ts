import axios from 'axios';
import { message } from 'antd';
import { SUCCESS_CODE } from '@/types/api';

const service = axios.create({
    baseURL: '/api/v1', // Matches backend prefix
    timeout: 5000,
});

// Request interceptor
service.interceptors.request.use(
    (config) => {
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

        // Backend returns { code: 0, msg: "success", data: ... }
        if (res.code !== undefined && res.code !== SUCCESS_CODE) {
            message.error(res.msg || 'Request failed');
            return Promise.reject(new Error(res.msg || 'Request failed'));
        }

        return res;
    },
    (error) => {
        console.error('Request Error:', error);

        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 401:
                    message.error('Unauthorized, please login again');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    message.error('Access denied');
                    break;
                case 404:
                    message.error('Resource not found');
                    break;
                case 500:
                    message.error('Server error');
                    break;
                default:
                    message.error(error.response.data?.msg || 'Request failed');
            }
        } else if (error.request) {
            message.error('Network error, please check your connection');
        } else {
            message.error('Request failed');
        }

        return Promise.reject(error);
    }
);

export default service;
