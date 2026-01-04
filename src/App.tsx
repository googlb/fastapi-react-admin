import React, { useEffect } from 'react';
import { Router } from '@/router/router';
import { useAuthStore } from '@/store/authStore';
import { useTabsStore } from '@/store/tabsStore';

const App: React.FC = () => {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // 当其他标签页的 auth-storage 发生变化时，强制当前标签页的 store 同步状态
      if (event.key === useAuthStore.persist.getOptions().name && event.newValue) {
        useAuthStore.persist.rehydrate();
      }
      // 当其他标签页的 tabs-storage 发生变化时，也进行同步
      if (event.key === useTabsStore.persist.getOptions().name && event.newValue) {
        useTabsStore.persist.rehydrate();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <Router />;
};

export default App;
