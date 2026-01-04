import axios, { type InternalAxiosRequestConfig,type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import { useAuthStore } from '@/store/authStore';
import { router } from '@/router/router';
import { SUCCESS_CODE, type ApiResponse } from '@/types/api';

// 1. 提取 BaseURL，避免到处硬编码
const BASE_URL = import.meta.env.VITE_API_PREFIX;

// 扩展 axios 配置
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const service = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 并发锁
let isRefreshing = false;
let requestQueue: Array<(token: string) => void> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  requestQueue.forEach((prom) => {
    if (error) {
      // reject(error) - 实际由外层 Promise 处理
    } else if (token) {
      prom(token);
    }
  });
  requestQueue = [];
};

// --- 请求拦截 ---
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 响应拦截 ---
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 强制类型转换，这里假设后端一定返回 ApiResponse 结构
    const res = response.data as ApiResponse;

    // 1. 业务逻辑错误处理
    if (res.code !== SUCCESS_CODE) {
      message.error(res.msg || '请求失败');
      return Promise.reject(new Error(res.msg || 'Business Error'));
    }

    // 2.【核心优化】自动解包：直接返回 data 字段
    // 这样前端组件调用时，拿到的就是干净的数据，不需要再 .data 了
    return res.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;

    // --- 401 自动刷新逻辑 ---
    if (status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          requestQueue.push((token) => {
            if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(service(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken, setTokens } = useAuthStore.getState();
        if (!refreshToken) throw new Error('No refresh token');

        // 【优化】使用 BASE_URL 变量拼接，不再硬编码
        // 注意：这里必须用 axios.post 而不是 service.post，防止无限循环
        const { data: refreshRes } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
            `${BASE_URL}/auth/refresh`,
            { refreshToken }
        );

        if (refreshRes.code === SUCCESS_CODE) {
            const newTokens = refreshRes.data;
            setTokens(newTokens);
            processQueue(null, newTokens.accessToken);

            if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return service(originalRequest);
        }
      } catch (refreshError) {
        processQueue(new Error('Refresh failed'), null);
        useAuthStore.getState().logout();
        message.warning('登录已过期');
        router.navigate('/login', { replace: true });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // --- 通用错误处理 ---
    const msg = (error.response?.data as any)?.msg || error.message || '请求失败';
    message.error(msg);
    return Promise.reject(error);
  }
);

// --- 3.【核心优化】类型友好的请求方法 ---
// T 代表最终返回的数据类型（已经解包后的）
export const request = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    service.get<T, T>(url, config), // 注意这里的类型参数变化

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    service.post<T, T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    service.put<T, T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    service.delete<T, T>(url, config),
};

export default service;
