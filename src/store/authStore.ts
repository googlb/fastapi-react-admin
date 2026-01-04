import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { login as loginApi } from '@/api/auth';
import { getCurrentUserInfo } from '@/api/system/user';
import type { User, LoginResponse } from '@/types/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      isAuthenticated: false,

      // 登录
      login: async (credentials) => {
        set({ loading: true });
        try {
          const response = await loginApi(credentials);
          if (response.code === 0 && response.data) {
            const { access_token, refresh_token } = response.data as LoginResponse;

            // 通过 setTokens 更新状态（persist 会自动保存到 localStorage）
            get().setTokens(access_token, refresh_token);

            // 同时标记为已认证，加载用户信息
            set({ loading: false, isAuthenticated: true });
            await get().fetchUserInfo(); // 登录成功后立即获取用户信息
          } else {
            throw new Error(response.msg || 'Login failed');
          }
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // 登出
      logout: () => {
        get().clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      // 获取用户信息
      fetchUserInfo: async () => {
        try {
          const response = await getCurrentUserInfo();
          if (response.code === 0 && response.data) {
            set({ user: response.data, isAuthenticated: true });
          } else {
            // 获取失败视为未登录
            get().logout();
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          get().logout(); // token 可能失效，直接登出
        }
      },

      // 内部方法：设置 token（persist 会自动同步到 storage）
      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true }),

      // 内部方法：清除 token
      clearTokens: () =>
        set({ accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // localStorage 中的 key
      storage: createJSONStorage(() => localStorage),
      // 可选：只持久化 token，不持久化 user/loading 等临时状态
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);



export default useAuthStore;
