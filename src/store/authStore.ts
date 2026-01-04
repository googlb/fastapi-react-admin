import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/types/api';

// Store State 的类型定义
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// Store Actions 的类型定义
interface AuthActions {
  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  logout: () => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: User) => void;
  reset: () => void;
}

// 初始状态
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      
      login: (tokens, user) =>
        set({
          ...tokens,
          user,
          isAuthenticated: true,
        }),
      
      logout: () => {
        set(initialState);
      },

      setTokens: (tokens) =>
        set({
          ...tokens,
        }),

      setUser: (user) => set({ user }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage', // localStorage 中的 key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        accessToken: state.accessToken, 
        refreshToken: state.refreshToken, 
        user: state.user 
      }),
    }
  )
);

// 订阅状态变化，动态更新 isAuthenticated
let lastAccessToken = useAuthStore.getState().accessToken;
useAuthStore.subscribe((state) => {
  const currentAccessToken = state.accessToken;
  if (currentAccessToken !== lastAccessToken) {
    // 使用 setImmediate 或 setTimeout 将更新推迟到下一个事件循环
    // 以避免在当前渲染周期内再次更新 state，这在某些 React 版本中可能导致警告
    Promise.resolve().then(() => {
        useAuthStore.setState({ isAuthenticated: !!currentAccessToken });
    });
  }
  lastAccessToken = currentAccessToken;
});