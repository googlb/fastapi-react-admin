import { create } from 'zustand';
import { type Menu, getMyMenus } from '@/api/system';

interface Tab {
    title: string;
    path: string;
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
}

export const useSystemStore = create<SystemState>((set, get) => ({
    menus: [],
    isSidebarCollapsed: false,
    tabs: [{ title: 'Dashboard', path: '/', closable: false }],
    activeTabPath: '/',

    fetchMenus: async () => {
        try {
            const res = await getMyMenus();
            if (res.code === 200) {
                set({ menus: res.data });
            }
        } catch (error) {
            console.error('Failed to fetch menus', error);
        }
    },

    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

    addTab: (tab) => {
        const { tabs } = get();
        if (!tabs.find((t) => t.path === tab.path)) {
            set({ tabs: [...tabs, tab], activeTabPath: tab.path });
        } else {
            set({ activeTabPath: tab.path });
        }
    },

    removeTab: (path) => {
        const { tabs, activeTabPath } = get();
        const newTabs = tabs.filter((t) => t.path !== path);

        let newActivePath = activeTabPath;
        if (activeTabPath === path) {
            newActivePath = newTabs[newTabs.length - 1]?.path || '/';
        }

        set({ tabs: newTabs, activeTabPath: newActivePath });
    },

    setActiveTab: (path) => set({ activeTabPath: path }),
}));
