import { request } from '@/utils/request';
import type { LoginResponse } from '@/types/api';

/**
 * 登录
 * 返回值类型直接是 LoginResponse ({ accessToken, refreshToken })
 * 不再包裹 ApiResponse
 */
export const loginApi = (data: { username: string; password: string }) => {
  return request.post<LoginResponse>('/auth/login', data);
};


/**
 * 退出
 */
export const logoutApi = () => {
  return request.post<void>('/auth/logout');
};
