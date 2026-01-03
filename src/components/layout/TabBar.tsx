import React, { useEffect } from 'react';
import { Tabs, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
  CloseOutlined,
  CloseCircleOutlined,
  ColumnWidthOutlined,
  MoreOutlined
} from '@ant-design/icons';
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
  const { tabs, activeTabKey, addTab, removeTab, setActiveTab, clearTabs } = useTabsStore();
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

  // 关闭其他标签
  const handleCloseOthers = () => {
    const currentTab = tabs.find(tab => tab.key === activeTabKey);
    const homeTab = tabs.find(tab => tab.key === '/');

    // 只保留首页和当前标签
    const keepTabs = [homeTab, currentTab].filter(Boolean);

    // 清除所有标签，然后重新添加
    clearTabs();
    keepTabs.forEach(tab => {
      if (tab) addTab(tab);
    });
  };

  // 关闭右侧标签
  const handleCloseRight = () => {
    const currentIndex = tabs.findIndex(tab => tab.key === activeTabKey);
    const rightTabs = tabs.slice(currentIndex + 1);

    rightTabs.forEach(tab => {
      if (tab.closable) {
        removeTab(tab.key);
      }
    });
  };

  // 关闭左侧标签（保留首页）
  const handleCloseLeft = () => {
    const currentIndex = tabs.findIndex(tab => tab.key === activeTabKey);
    const leftTabs = tabs.slice(1, currentIndex); // 从索引1开始，跳过首页

    leftTabs.forEach(tab => {
      if (tab.closable) {
        removeTab(tab.key);
      }
    });
  };

  // 关闭所有标签（保留首页）
  const handleCloseAll = () => {
    clearTabs();
    setActiveTab('/');
    navigate('/');
  };

  // 操作菜单
  const operationMenuItems: MenuProps['items'] = [
    {
      key: 'close-others',
      icon: <CloseCircleOutlined />,
      label: '关闭其他',
      onClick: handleCloseOthers,
      disabled: tabs.filter(t => t.closable).length <= 1,
    },
    {
      key: 'close-right',
      icon: <ColumnWidthOutlined />,
      label: '关闭右侧',
      onClick: handleCloseRight,
      disabled: tabs.findIndex(t => t.key === activeTabKey) >= tabs.length - 1,
    },
    {
      key: 'close-left',
      icon: <ColumnWidthOutlined className="scale-x-[-1]" />,
      label: '关闭左侧',
      onClick: handleCloseLeft,
      disabled: tabs.findIndex(t => t.key === activeTabKey) <= 1,
    },
    {
      type: 'divider',
    },
    {
      key: 'close-all',
      icon: <CloseOutlined />,
      label: '关闭所有',
      onClick: handleCloseAll,
      disabled: tabs.filter(t => t.closable).length === 0,
    },
  ];

  // 转换为 Ant Design Tabs 格式
  const items = tabs.map(tab => ({
    key: tab.key,
    label: tab.label,
    closable: tab.closable,
  }));

  return (
    <div className="bg-white border-b border-gray-200 flex items-stretch pt-2">
      <div className="flex-1 overflow-hidden">
        <Tabs
          type="editable-card"
          hideAdd
          activeKey={activeTabKey}
          onChange={handleTabChange}
          onEdit={handleTabEdit}
          items={items}
          size="small"
          className="w-full [&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav]:!border-0 [&_.ant-tabs-nav]:pl-3"
          tabBarGutter={4}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex-shrink-0 px-2 border-l border-gray-200 flex items-center">
        <Dropdown menu={{ items: operationMenuItems }} placement="bottomRight">
          <div className="cursor-pointer px-3 py-1 hover:bg-gray-100 rounded transition-colors">
            <MoreOutlined className="text-base" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default TabBar;
