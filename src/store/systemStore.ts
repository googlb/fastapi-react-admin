import { create } from 'zustand';
import { type Menu, getMyMenus } from '@/api/system';
import { SUCCESS_CODE } from '@/types/api';

interface Tab {
    key: string;
    label: string;
    closable: boolean;
}

interface SystemState {
    menus: Menu[];
    isSidebarCollapsed: boolean;
    tabs: Tab[];
    activeTabPath: string;

    fetchMenus: () => Promise<void>;
    toggleSidebar: () => void;
    addTab: (tab: Tab) => void;
    removeTab: (path: string) => void;
    setActiveTab: (path: string) => void;
    clearAllTabs: () => void;
    clearOtherTabs: (exceptPath: string) => void;
}

export const useSystemStore = create<SystemState>((set, get) => ({
    menus: [],
    isSidebarCollapsed: false,
    tabs: [{ key: '/', label: 'Dashboard', closable: false }],
    activeTabPath: '/',

    fetchMenus: async () => {
        try {
            const res = await getMyMenus();
            if (res.code === SUCCESS_CODE) {
                set({ menus: res.data || [] });
            }
        } catch (error) {
            console.error('Failed to fetch menus', error);
        }
    },

    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

    addTab: (tab) => {
        const { tabs } = get();
        if (!tabs.find((t) => t.key === tab.key)) {
            set({ tabs: [...tabs, tab], activeTabPath: tab.key });
        } else {
            set({ activeTabPath: tab.key });
        }
    },

    removeTab: (path) => {
        const { tabs, activeTabPath } = get();
        const newTabs = tabs.filter((t) => t.key !== path);

        let newActivePath = activeTabPath;
        if (activeTabPath === path) {
            newActivePath = newTabs[newTabs.length - 1]?.key || '/';
        }

        set({ tabs: newTabs, activeTabPath: newActivePath });
    },

    setActiveTab: (path) => set({ activeTabPath: path }),

    clearAllTabs: () => {
        set({
            tabs: [{ key: '/', label: 'Dashboard', closable: false }],
            activeTabPath: '/',
        });
    },

    clearOtherTabs: (exceptPath) => {
        const { tabs } = get();
        const newTabs = tabs.filter((t) => t.key === exceptPath || t.key === '/');
        set({ tabs: newTabs });
    },
}));
