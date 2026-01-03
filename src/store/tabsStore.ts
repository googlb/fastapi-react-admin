import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tab {
  key: string;      // 路由路径
  label: string;    // 显示标题
  closable: boolean; // 是否可关闭
}

interface TabsState {
  tabs: Tab[];
  activeTabKey: string;
  addTab: (tab: Tab) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  clearTabs: () => void;
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [
        { key: '/', label: '首页', closable: false }
      ],
      activeTabKey: '/',

      addTab: (tab: Tab) => {
        const { tabs } = get();
        const exists = tabs.find(t => t.key === tab.key);

        if (!exists) {
          set({ tabs: [...tabs, tab], activeTabKey: tab.key });
        } else {
          set({ activeTabKey: tab.key });
        }
      },

      removeTab: (key: string) => {
        const { tabs, activeTabKey } = get();
        const newTabs = tabs.filter(t => t.key !== key);

        // 如果关闭的是当前激活的标签，需要切换到其他标签
        let newActiveKey = activeTabKey;
        if (activeTabKey === key && newTabs.length > 0) {
          const activeIndex = tabs.findIndex(t => t.key === key);
          const nextIndex = activeIndex >= newTabs.length ? newTabs.length - 1 : activeIndex;
          newActiveKey = newTabs[nextIndex].key;
        }

        set({ tabs: newTabs, activeTabKey: newActiveKey });
      },

      setActiveTab: (key: string) => {
        set({ activeTabKey: key });
      },

      clearTabs: () => {
        set({
          tabs: [{ key: '/', label: '首页', closable: false }],
          activeTabKey: '/'
        });
      },
    }),
    {
      name: 'tabs-storage',
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabKey: state.activeTabKey,
      }),
    }
  )
);
