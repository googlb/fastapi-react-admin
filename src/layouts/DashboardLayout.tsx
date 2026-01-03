import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import TabBar from '@/components/layout/TabBar';
import { useSystemStore } from '@/store/systemStore';
import { useAuthStore } from '@/store/authStore';
import type { Menu } from '@/types/api';

const { Content } = Layout;

// 在菜单树中查找路径，构建面包屑
const findBreadcrumbPath = (
  menus: Menu[],
  targetPath: string,
  accumulated: Array<{ title: string; path: string }> = []
): Array<{ title: string; path: string }> | null => {
  for (const menu of menus) {
    const current = [...accumulated, { title: menu.title, path: menu.path || '' }];

    if (menu.path === targetPath) {
      return current;
    }

    if (menu.children && menu.children.length > 0) {
      const found = findBreadcrumbPath(menu.children, targetPath, current);
      if (found) return found;
    }
  }
  return null;
};

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const { menus, fetchMyMenus } = useSystemStore();
  const { fetchUserInfo } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumbItems, setBreadcrumbItems] = useState<Array<{ title: React.ReactNode; path?: string }>>([
    { title: <HomeOutlined />, path: '/' }
  ]);

  // 初始化：获取菜单和用户信息
  useEffect(() => {
    fetchMyMenus();
    fetchUserInfo();
  }, [fetchMyMenus, fetchUserInfo]);

  // 监听路由变化，更新面包屑
  useEffect(() => {
    const pathname = location.pathname;

    if (pathname === '/') {
      setBreadcrumbItems([{ title: <HomeOutlined />, path: '/' }]);
      return;
    }

    const breadcrumbPath = findBreadcrumbPath(menus, pathname);

    if (breadcrumbPath && breadcrumbPath.length > 0) {
      setBreadcrumbItems([
        { title: <HomeOutlined />, path: '/' },
        ...breadcrumbPath.map(item => ({
          title: item.title,
          path: item.path,
        })),
      ]);
    } else {
      // 如果找不到面包屑路径，使用当前路径
      setBreadcrumbItems([
        { title: <HomeOutlined />, path: '/' },
        { title: pathname.split('/').filter(Boolean).join(' / ') },
      ]);
    }
  }, [location.pathname, menus]);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="min-h-screen">
      {/* 侧边栏 */}
      <Sidebar collapsed={collapsed} />

      {/* 主内容区域 */}
      <Layout
        className="transition-all duration-200"
        style={{ marginLeft: collapsed ? 80 : 256 }}
      >
        {/* 顶部栏 */}
        <Header
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          breadcrumbItems={breadcrumbItems}
        />

        {/* 标签页 */}
        <TabBar />

        {/* 内容区 */}
        <Content className="m-0 p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-64px-48px-48px)]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
