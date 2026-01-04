import React, { lazy, Suspense } from 'react';
import {createBrowserRouter, Navigate, RouterProvider, useLocation} from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

import { useIsAuthenticated} from '@/store/authStore';
import {PageLoading} from "@ant-design/pro-components";

// 懒加载组件
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Users = lazy(() => import('@/pages/system/Users'));
const Roles = lazy(() => import('@/pages/system/Roles'));
const Menus = lazy(() => import('@/pages/system/Menus'));
const Profile = lazy(() => import('@/pages/user/Profile'));
const Settings = lazy(() => import('@/pages/user/Settings'));

// 通用占位页面
const PlaceholderPage = lazy(() => import('@/pages/PlaceholderPage'));



// 路由守卫：保护需要登录的路由
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  const location = useLocation();

  if (!isAuthenticated) {
    // replace: true 防止回退，state: 记录来源
    return <Navigate to="/login" replace state={{ from: location }} />;
  }


  return <>{children}</>;
};

// 路由守卫：已登录用户重定向
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  // 优先跳回之前的页面，如果没有则跳首页
  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoading />}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
            <Dashboard />
        ),
      },
      // 系统管理
      {
        path: 'system/users',
        element: (
            <Users />
        ),
      },
      {
        path: 'system/roles',
        element: (
            <Roles />
        ),
      },
      {
        path: 'system/menus',
        element: (
            <Menus />
        ),
      },
      {
        path: 'system/:page',
        element: (
            <PlaceholderPage />
        ),
      },
      // 内容管理
      {
        path: 'content/:page',
        element: (
            <PlaceholderPage />
        ),
      },
      // 监控管理
      {
        path: 'monitor/:page',
        element: (
            <PlaceholderPage />
        ),
      },
      // 工具管理
      {
        path: 'tools/:page',
        element: (
            <PlaceholderPage />
        ),
      },
      // 用户中心
      {
        path: 'user/profile',
        element: (
            <Profile />
        ),
      },
      {
        path: 'user/settings',
        element: (
            <Settings />
        ),
      },
      // 通配符路由 - 捕获所有其他路径
      {
        path: '*',
        element: (
            <PlaceholderPage />
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

// 导出 Router 组件
export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default router;
