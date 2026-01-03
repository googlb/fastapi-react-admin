import { create } from 'zustand';
import { getMyMenus } from '@/api/system/menu';
import type { Menu } from '@/types/api';
import { mockMenus } from '@/mocks/mockMenus';

interface SystemState {
  menus: Menu[];
  loading: boolean;
  fetchMyMenus: () => Promise<void>;
  setMockMenus: () => void; // 用于测试的 Mock 数据
}

// 是否使用 Mock 数据（开发环境测试用）
const USE_MOCK = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true';

export const useSystemStore = create<SystemState>((set) => ({
  menus: [],
  loading: false,

  fetchMyMenus: async () => {
    // 如果开启了 Mock 模式，直接使用 Mock 数据
    if (USE_MOCK) {
      set({ menus: mockMenus, loading: false });
      return;
    }

    set({ loading: true });
    try {
      const response = await getMyMenus();
      if (response.code === 0 && response.data) {
        set({ menus: response.data, loading: false });
      } else {
        set({ menus: [], loading: false });
      }
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      set({ menus: [], loading: false });
    }
  },

  // 手动设置 Mock 数据（用于测试）
  setMockMenus: () => {
    set({ menus: mockMenus, loading: false });
  },
}));
