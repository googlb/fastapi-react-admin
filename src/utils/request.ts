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

    const res = response.data as ApiResponse;

    if (res.code !== SUCCESS_CODE) {

      message.error(res.msg || 'Request Error');

      return Promise.reject(new Error(res.msg || 'Error'));

    }

    return res.data;

  },

  async (error: AxiosError) => {

    const originalRequest = error.config;



    // 如果请求配置不存在，或错误不是由 401 引起，则直接抛出错误

    if (!originalRequest || error.response?.status !== 401) {

      // 避免重复提示已处理的业务错误

      if (error.message.includes('Business Error')) {

        return Promise.reject(error);

      }

      const msg = (error.response?.data as any)?.msg || error.message || '请求失败';

      message.error(msg);

      return Promise.reject(error);

    }

    

    // 对于登录请求的401错误，不进行刷新，直接抛出

    if (originalRequest.url?.includes('/auth/login')) {

      return Promise.reject(error);

    }

    

    // 如果正在刷新token，则将当前请求加入队列

    if (isRefreshing) {

      return new Promise((resolve) => {

        requestQueue.push((token) => {

          if (originalRequest.headers) {

            originalRequest.headers.Authorization = `Bearer ${token}`;

          }

          resolve(service(originalRequest));

        });

      });

    }



    // 设置刷新状态锁，并标记当前请求已重试

    isRefreshing = true;

    originalRequest._retry = true;



    const { refreshToken, logout } = useAuthStore.getState();



    // 如果没有刷新令牌，直接登出

    if (!refreshToken) {

      logout();

      router.navigate('/login', { replace: true });

      isRefreshing = false;

      message.warning('登录已过期，请重新登录');

      return Promise.reject(new Error('No refresh token available.'));

    }



    try {

      // 发送刷新请求

      const { data: refreshRes } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(

        `${BASE_URL}/auth/refresh`,

        { refreshToken },

      );



      // 刷新成功

      if (refreshRes.code === SUCCESS_CODE) {

        const newTokens = refreshRes.data;

        useAuthStore.getState().setTokens(newTokens);

        

        // 使用新令牌重试原始请求

        if (originalRequest.headers) {

          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;

        }



        // 重新执行队列中的所有请求

        processQueue(null, newTokens.accessToken);



        return service(originalRequest);

      } else {

        // 刷新被后端拒绝（例如 refresh_token 也过期了）

        throw new Error(refreshRes.msg || 'Session expired');

      }

    } catch (refreshError) {

      // 刷新过程中发生任何错误，都执行登出

      processQueue(refreshError as Error, null); // 通知队列中的所有请求刷新失败

      logout();

      router.navigate('/login', { replace: true });

      message.warning('登录已过期，请重新登录');

      return Promise.reject(refreshError);

    } finally {

      // 释放刷新锁

      isRefreshing = false;

    }

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
