import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { loginApi } from '@/api/auth'; // 确保引入的是之前优化过的 API
import type { User } from '@/types/api';
import {getCurrentUserInfo} from "@/api/system/user.ts";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
}

interface AuthActions {
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchUserInfo: () => Promise<void>;
  // 简化 setTokens，直接传对象更灵活
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearTokens: () => void;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (credentials) => {
        set({ loading: true });
        try {
          // 1. 调用登录接口
          // 注意：根据 request.ts 的优化，这里不需要判断 code === 0
          // res 直接就是 LoginResponse 类型
          const res = await loginApi(credentials);

          // 2. 兼容后端可能返回的 snake_case 或 camelCase
          // 假设后端返回 access_token，我们在 request.ts 或这里转为 accessToken
          const accessToken = res.accessToken || (res as any).access_token;
          const refreshToken = res.refreshToken || (res as any).refresh_token;

          // 3. 设置 Token
          get().setTokens({ accessToken, refreshToken });

          // 4. 获取用户信息
          // 串行等待，确保 UI 渲染时已有用户信息
          await get().fetchUserInfo();
        } catch (error) {
          // 错误由 request.ts 统一弹窗，这里只需重置 loading
          // 并抛出错误供 UI 组件（如 Login 页面）停止加载动画
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        // 1. 清理状态
        set(initialState);
        // 2. 彻底清理缓存
        localStorage.removeItem('auth-storage');
        // 3. 如果需要，可以在这里调用后端 logout 接口（不强制等待）
        // logoutApi();
      },

      fetchUserInfo: async () => {
        // 如果已经有 user 数据且不需要强制刷新，可以加判断跳过
        // 但通常为了数据新鲜度，每次刷新页面都拉取一次是合理的
        try {
          const user = await getCurrentUserInfo();
          set({ user });
        } catch (error) {
          console.error('Failed to fetch user info:', error);
          // 注意：不要在这里轻易调用 logout()
          // 如果只是网络波动导致获取用户信息失败，用户还在登录有效期内，
          // 直接踢出体验不好。只有 401 错误（由 request.ts 处理）才应该踢出。
        }
      },

      setTokens: ({ accessToken, refreshToken }) =>
        set({ accessToken, refreshToken }),

      clearTokens: () =>
        set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 核心优化：将 user 也放入持久化
      // 这样刷新页面瞬间，用户头像和名字还在，体验更好
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

// Selector Hook
export const useIsAuthenticated = () => useAuthStore((state) => !!state.accessToken);
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthLoading = () => useAuthStore((state) => state.loading);
