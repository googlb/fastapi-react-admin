import React from 'react';
import { Layout, Button, Breadcrumb, Dropdown, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  breadcrumbItems: Array<{ title: React.ReactNode; path?: string }>;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggleCollapse, breadcrumbItems }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/user/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/user/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      className="flex items-center justify-between bg-white px-6 shadow-sm border-b border-gray-200"
      style={{
        padding: '0 24px 0 10px',
        height: 64,
        lineHeight: '64px',
        backgroundColor: '#fff'
      }}
    >
      {/* Left: Toggle button + Breadcrumb */}
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          style={{
            fontSize: 16,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Right: User dropdown */}
      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
          <Avatar
            size="default"
            src={user?.avatar || undefined}
            icon={<UserOutlined />}
          />
          <span className="text-sm">{user?.username || 'Admin'}</span>
        </div>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;
