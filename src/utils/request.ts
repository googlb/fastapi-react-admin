import axios, { type InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { useAuthStore } from '@/store/authStore';
import { SUCCESS_CODE } from '@/types/api';

const service = axios.create({
    baseURL: import.meta.env.VITE_API_PREFIX,
    timeout: 10000,
});

// Request interceptor
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 直接从 store 的 state 中获取 token
        const { accessToken } = useAuthStore.getState();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
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

        if (res.code !== undefined && res.code !== SUCCESS_CODE) {
            message.error(res.msg || 'Request failed');
            return Promise.reject(new Error(res.msg || 'Request failed'));
        }

        return res;
    },
    async (error) => {
        console.error('Request Error:', error);

        if (error.response) {
            const status = error.response.status;
            const originalRequest = error.config;

            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                
                const { refreshToken } = useAuthStore.getState();
                if (!refreshToken) {
                    message.error('会话已过期，请重新登录');
                    useAuthStore.getState().logout();
                    window.location.href = '/login';
                    return Promise.reject(new Error('No refresh token, redirecting to login.'));
                }

                try {
                    // --- Token 刷新逻辑占位 ---
                    // 实际项目中，你需要调用后端的刷新 token 接口
                    // const { data: newTokens } = await axios.post('/api/auth/refresh', { refreshToken });
                    // 此处为模拟
                    console.log("尝试刷新 Token...");
                    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
                    const newTokens = { accessToken: 'new_fake_access_token', refreshToken: 'new_fake_refresh_token' };
                    
                    useAuthStore.getState().setTokens(newTokens);
                    
                    originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                    return service(originalRequest);

                } catch (refreshError) {
                    message.error('会话刷新失败，请重新登录');
                    useAuthStore.getState().logout();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else if (status === 401 && originalRequest._retry) {
                 message.error('会话刷新失败，请重新登录');
                 useAuthStore.getState().logout();
                 window.location.href = '/login';
                 return Promise.reject(error);
            }

            switch (status) {
                case 403:
                    message.error('访问被拒绝');
                    break;
                case 404:
                    message.error('资源未找到');
                    break;
                case 500:
                    message.error('服务器内部错误');
                    break;
                default:
                    if (status !== 401) { // 避免401被重复提示
                       message.error(error.response.data?.msg || '请求失败');
                    }
            }
        } else if (error.request) {
            message.error('网络错误，请检查您的连接');
        } else {
            message.error('请求发起失败');
        }

        return Promise.reject(error);
    }
);

export default service;
