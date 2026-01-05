import React, { lazy, Suspense } from 'react';
import {createBrowserRouter, Navigate, RouterProvider, useLocation} from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

import { useIsAuthenticated} from '@/store/authStore';
import {PageLoading} from "@ant-design/pro-components";
import DynamicRoute from "@/components/route/DynamicRoute.tsx";

// 懒加载组件
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/user/Profile'));
const Settings = lazy(() => import('@/pages/user/Settings'));




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
    children: [{ index: true, element: <Suspense fallback={<PageLoading />}><Login /></Suspense> }],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<PageLoading />}><Dashboard /></Suspense> },
      // 个人中心等非菜单驱动页面可保留硬编码
      { path: 'user/profile', element: <Suspense fallback={<PageLoading />}><Profile /></Suspense> },
      { path: 'user/settings', element: <Suspense fallback={<PageLoading />}><Settings /></Suspense> },
      // 所有菜单路径（包括 /system/users、/report/sales、/business/order 等）都走动态加载
      { path: '*', element: <Suspense fallback={<PageLoading />}><DynamicRoute /></Suspense> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

// 导出 Router 组件
export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default router;
