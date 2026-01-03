import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTabsStore } from '@/store/tabsStore';
import { useSystemStore } from '@/store/systemStore';
import type { Menu } from '@/types/api';

// 在菜单树中查找指定路径的标题
const findMenuTitle = (menus: Menu[], path: string): string | undefined => {
  for (const menu of menus) {
    if (menu.path === path) return menu.title;
    if (menu.children) {
      const found = findMenuTitle(menu.children, path);
      if (found) return found;
    }
  }
  return undefined;
};

const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabs, activeTabKey, addTab, removeTab, setActiveTab } = useTabsStore();
  const { menus } = useSystemStore();

  // 监听路由变化，自动添加/激活标签
  useEffect(() => {
    const pathname = location.pathname;

    // 首页特殊处理
    if (pathname === '/') {
      setActiveTab('/');
      return;
    }

    // 查找菜单标题
    const title = findMenuTitle(menus, pathname);

    if (title) {
      addTab({
        key: pathname,
        label: title,
        closable: true,
      });
    } else {
      // 如果找不到菜单标题，使用路径作为标题
      addTab({
        key: pathname,
        label: pathname.split('/').pop() || pathname,
        closable: true,
      });
    }
  }, [location.pathname, menus, addTab, setActiveTab]);

  // 切换标签
  const handleTabChange = (activeKey: string) => {
    setActiveTab(activeKey);
    navigate(activeKey);
  };

  // 关闭标签
  const handleTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'remove' && typeof targetKey === 'string') {
      // 找到要删除的标签
      const targetTab = tabs.find(tab => tab.key === targetKey);
      if (!targetTab || !targetTab.closable) return;

      // 删除标签
      removeTab(targetKey);

      // 如果删除的是当前激活的标签，需要导航到新的激活标签
      if (activeTabKey === targetKey) {
        const { activeTabKey: newActiveKey } = useTabsStore.getState();
        if (newActiveKey !== targetKey) {
          navigate(newActiveKey);
        }
      }
    }
  };

  // 转换为 Ant Design Tabs 格式
  const items = tabs.map(tab => ({
    key: tab.key,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <div className="bg-white border-b border-gray-200">
      <Tabs
        type="editable-card"
        hideAdd
        activeKey={activeTabKey}
        onChange={handleTabChange}
        onEdit={handleTabEdit}
        items={items}
        size="small"
        className="w-full"
        tabBarStyle={{ margin: 0, border: 'none', paddingLeft: 12 }}
      />
    </div>
  );
};

export default TabBar;
