import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import TabBar from '@/components/layout/TabBar';
import { PageLoading } from '@/components/PageLoading'; // 确保导入了之前封装的 Loading 组件
import { useSystemStore } from '@/store/systemStore';
import { useAuthStore } from '@/store/authStore';
import type { Menu } from '@/types/api';

const { Content } = Layout;

// 辅助函数：递归查找面包屑路径
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

  // 1. 优化：Sidebar 折叠状态持久化
  // 使用 lazy initializer 读取 localStorage，只在初始化时执行一次
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // 初始化数据获取
  useEffect(() => {
    // 使用 Promise.all 并行请求，虽然 Zustand action 可能是 void，但这是一个好习惯
    fetchMyMenus();
    fetchUserInfo();
  }, [fetchMyMenus, fetchUserInfo]);

  // 监听 collapsed 变化并保存到 localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // 2. 优化：使用 useMemo 计算面包屑
  // 替代了之前的 useEffect + useState，避免了额外的渲染周期
  const breadcrumbItems = useMemo(() => {
    const pathname = location.pathname;
    const homeItem = { title: <HomeOutlined />, path: '/' };

    if (pathname === '/') {
      return [homeItem];
    }

    const matchedPath = findBreadcrumbPath(menus, pathname);

    if (matchedPath && matchedPath.length > 0) {
      return [
        homeItem,
        ...matchedPath.map((item) => ({
          title: item.title,
          path: item.path, // 注意：如果 path 是空字符串，Antd Breadcrumb 可能不会将其渲染为链接
        })),
      ];
    }

    // Fallback: 如果菜单里没找到，简单显示路径名 (优化了显示格式)
    const pathSnippets = pathname.split('/').filter((i) => i);
    const extraItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const title = pathSnippets[index].charAt(0).toUpperCase() + pathSnippets[index].slice(1);
      return { title, path: url };
    });

    return [homeItem, ...extraItems];
  }, [location.pathname, menus]);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="h-screen overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar collapsed={collapsed} />

      <Layout className="flex flex-col h-full bg-slate-50 transition-all duration-200">
        {/* 顶部导航 */}
        <Header
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          breadcrumbItems={breadcrumbItems}
        />

        {/* 多页签栏 */}
        <TabBar />

        {/* 内容区域 */}
        <Content className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          {/*
            3. 关键修改：添加 Suspense
            因为路由中使用了 lazy 加载，必须在这里包裹 Suspense，
            否则切换路由时 React 不知道在加载组件时显示什么，会报错。
          */}
          <Suspense fallback={<PageLoading />}>
            {/*
              这里的容器样式可以根据需求调整。
              目前保留了你的白色卡片风格，但加了 min-h-full 确保填满
            */}
            <div className="bg-white rounded-lg shadow-sm min-h-full relative animate-fade-in">
                {/*
                  如果有些页面（如大屏报表）不需要白色背景和 padding，
                  可以在这里判断 location 或者在路由元数据中配置，动态去掉这些 class
                */}
                <div className="p-6">
                   <Outlet />
                </div>
            </div>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
