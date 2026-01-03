import { create } from 'zustand';
import { getMyMenus } from '@/api/system/menu';
import type { Menu } from '@/types/api';

interface SystemState {
  menus: Menu[];
  loading: boolean;
  fetchMyMenus: () => Promise<void>;
}

export const useSystemStore = create<SystemState>((set) => ({
  menus: [],
  loading: false,
  fetchMyMenus: async () => {
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
}));