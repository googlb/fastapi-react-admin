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

const convertMenusToItems = (menus: MenuType[]): MenuProps['items'] => {
  return menus
    .filter(menu => menu.is_visible && menu.menu_type !== 3)
    .map(menu => {
      const item: any = {
        key: menu.path || `menu-${menu.id}`,
        label: menu.title,
        icon: menu.icon ? <DynamicIcon type={menu.icon} /> : null,
      };

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
      theme="dark"
      className="overflow-y-auto scrollbar-hide select-none"
    >
      <div className={`h-16 flex items-center justify-center text-white font-bold border-b border-white/10 ${collapsed ? 'text-xl' : 'text-2xl'}`}>
        {collapsed ? 'FP' : 'FastAPI Admin'}
      </div>

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
