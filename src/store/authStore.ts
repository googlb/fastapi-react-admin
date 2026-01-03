import { create } from 'zustand';
import { login as loginApi } from '@/api/auth';
import { getCurrentUserInfo } from '@/api/system/user';
import type { User, LoginResponse } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  isAuthenticated: false,
  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await loginApi(credentials);
      if (response.code === 0 && response.data) {
        const { access_token, refresh_token } = response.data as LoginResponse;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        set({ 
          token: access_token, 
          refreshToken: refresh_token, 
          loading: false, 
          isAuthenticated: true 
        });
      } else {
        throw new Error(response.msg || 'Login failed');
      }
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },
  fetchUserInfo: async () => {
    try {
      const response = await getCurrentUserInfo();
      if (response.code === 0 && response.data) {
        set({ user: response.data, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // 如果获取用户信息失败，可能意味着token已过期，执行登出
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
    }
  },
}));