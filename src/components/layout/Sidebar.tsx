import React from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useSystemStore } from '@/store/systemStore';
import { useNavigate, useLocation } from 'react-router-dom';
import DynamicIcon from '@/components/DynamicIcon';
import type { Menu as MenuType } from '@/types/api';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

// 递归转换菜单数据为 Ant Design Menu 格式
const convertMenusToItems = (menus: MenuType[]): MenuProps['items'] => {
  return menus
    .filter(menu => menu.is_visible && menu.menu_type !== 3) // 过滤掉按钮类型和隐藏菜单
    .map(menu => {
      const item: any = {
        key: menu.path || `menu-${menu.id}`,
        label: menu.title,
        icon: menu.icon ? <DynamicIcon type={menu.icon} /> : null,
      };

      // 如果有子菜单，递归处理
      if (menu.children && menu.children.length > 0) {
        item.children = convertMenusToItems(menu.children);
      }

      return item;
    });
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menus } = useSystemStore();

  const menuItems = convertMenusToItems(menus);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={256}
      collapsedWidth={80}
      className="fixed left-0 top-0 bottom-0 z-10 h-screen overflow-auto"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center text-white font-bold border-b border-white/10">
        <span className={collapsed ? 'text-xl' : 'text-2xl'}>
          {collapsed ? 'FP' : 'FastAPI Admin'}
        </span>
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={handleMenuClick}
        items={menuItems}
        className="border-r-0"
      />
    </Sider>
  );
};

export default Sidebar;
