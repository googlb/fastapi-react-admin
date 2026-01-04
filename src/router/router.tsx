import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuthStore } from '@/store/authStore';

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

// Loading 组件
const PageLoading: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
    <div className="relative w-24 h-24">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`absolute w-8 h-8 rounded-full animate-ping`}
          style={{
            backgroundColor: ['#3B82F6', '#10B981', '#8e51ff'][i],
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 120}deg) translateX(-100%) translateY(-50%)`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
    <span className="text-gray-500 text-xl">加载中，请稍候...</span>
  </div>
);

// 路由守卫：保护需要登录的路由
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// 路由守卫：已登录用户重定向
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// 路由配置
const router = createBrowserRouter([
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
          <Suspense fallback={<PageLoading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      // 系统管理
      {
        path: 'system/users',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Users />
          </Suspense>
        ),
      },
      {
        path: 'system/roles',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Roles />
          </Suspense>
        ),
      },
      {
        path: 'system/menus',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Menus />
          </Suspense>
        ),
      },
      {
        path: 'system/:page',
        element: (
          <Suspense fallback={<PageLoading />}>
            <PlaceholderPage />
          </Suspense>
        ),
      },
      // 内容管理
      {
        path: 'content/:page',
        element: (
          <Suspense fallback={<PageLoading />}>
            <PlaceholderPage />
          </Suspense>
        ),
      },
      // 监控管理
      {
        path: 'monitor/:page',
        element: (
          <Suspense fallback={<PageLoading />}>
            <PlaceholderPage />
          </Suspense>
        ),
      },
      // 工具管理
      {
        path: 'tools/:page',
        element: (
          <Suspense fallback={<PageLoading />}>
            <PlaceholderPage />
          </Suspense>
        ),
      },
      // 用户中心
      {
        path: 'user/profile',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: 'user/settings',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Settings />
          </Suspense>
        ),
      },
      // 通配符路由 - 捕获所有其他路径
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoading />}>
            <PlaceholderPage />
          </Suspense>
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
