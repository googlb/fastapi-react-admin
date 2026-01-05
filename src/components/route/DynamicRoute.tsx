import React, { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageLoading } from '@ant-design/pro-components';
import { Result } from 'antd';
import { useSystemStore } from '@/store/systemStore';
import type { Menu } from '@/types/api';

/**
 * 使用 Vite 的 glob 导入功能自动加载所有页面
 * 约定：路由 /system/users 自动映射到 pages/system/users/index.tsx
 */

// 方式1：使用 @/pages（推荐，配合 vite.config.ts 的 alias）
const modules = import.meta.glob<{ default: React.ComponentType<any> }>(
  '@/pages/**/index.tsx',
  { eager: false }
);

// 方式2：如果方式1不工作，使用绝对路径
// const modules = import.meta.glob<{ default: React.ComponentType<any> }>(
//   '/src/pages/**/index.tsx',
//   { eager: false }
// );

/**
 * 构建路径映射表
 * 将文件路径转换为路由路径
 */
const createModuleMap = () => {
  const map: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {};

  Object.keys(modules).forEach((filePath) => {
    // filePath 示例: "@/pages/system/users/index.tsx" 或 "/src/pages/system/users/index.tsx"
    let routePath: string | null = null;

    // 尝试匹配 @/pages 格式
    let match = filePath.match(/@\/pages(\/.+?)\/index\.tsx$/);
    if (match) {
      routePath = match[1]; // 得到 "/system/users"
    } else {
      // 尝试匹配 /src/pages 格式
      match = filePath.match(/\/src\/pages(\/.+?)\/index\.tsx$/);
      if (match) {
        routePath = match[1];
      }
    }

    if (routePath) {
      map[routePath] = modules[filePath];

      // 开发环境输出注册信息
      if (import.meta.env.DEV) {
        console.log(`%c[Route Register]`, 'color: #10b981; font-weight: bold', routePath, '←', filePath);
      }
    }
  });

  // 输出所有已注册的路由
  if (import.meta.env.DEV) {
    console.log('%c[Route Map]', 'color: #3b82f6; font-weight: bold', 'All registered routes:', Object.keys(map));
  }

  return map;
};

// 创建模块映射表（只执行一次）
const moduleMap = createModuleMap();

/**
 * 扁平化菜单树，获取所有有权限的路径
 */
const flattenMenuPaths = (menus: Menu[]): Set<string> => {
  const paths = new Set<string>();

  const traverse = (menuList: Menu[]) => {
    menuList.forEach((menu) => {
      // 只收集菜单类型（menu_type=2）、可见、且启用的路径
      if (menu.path && menu.menu_type === 2 && menu.is_visible && menu.status === 1) {
        paths.add(menu.path);
      }
      if (menu.children?.length) {
        traverse(menu.children);
      }
    });
  };

  traverse(menus);
  return paths;
};

/**
 * 动态路由组件
 */
const DynamicRoute: React.FC = () => {
  const location = useLocation();
  const { menus } = useSystemStore();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<{ type: string; message?: string } | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      const currentPath = location.pathname;

      console.log('%c[DynamicRoute]', 'color: #f59e0b; font-weight: bold', 'Loading:', currentPath);

      // 重置状态
      setComponent(null);
      setError(null);

      // 1. 权限验证：检查路径是否在菜单中
      const allowedPaths = flattenMenuPaths(menus);
      console.log('%c[DynamicRoute]', 'color: #8b5cf6; font-weight: bold', 'Allowed paths:', Array.from(allowedPaths));

      if (!allowedPaths.has(currentPath)) {
        console.warn('%c[DynamicRoute]', 'color: #ef4444; font-weight: bold', '403 Forbidden:', currentPath);
        setError({ type: '403' });
        return;
      }

      // 2. 查找对应的模块加载器
      const loader = moduleMap[currentPath];
      if (!loader) {
        console.error('%c[DynamicRoute]', 'color: #ef4444; font-weight: bold', '404 Not Found:', currentPath);
        console.table(Object.keys(moduleMap)); // 方便调试：显示所有已注册路径
        setError({
          type: '404',
          message: `请确认文件存在：src/pages${currentPath}/index.tsx`
        });
        return;
      }

      // 3. 动态加载组件
      try {
        console.log('%c[DynamicRoute]', 'color: #10b981; font-weight: bold', 'Loading module:', currentPath);
        const module = await loader();
        console.log('%c[DynamicRoute]', 'color: #10b981; font-weight: bold', 'Loaded successfully:', currentPath);
        setComponent(() => module.default);
        setError(null);
      } catch (err) {
        console.error('%c[DynamicRoute]', 'color: #ef4444; font-weight: bold', 'Load failed:', err);
        setError({ type: '500', message: String(err) });
      }
    };

    loadComponent();
  }, [location.pathname, menus]);

  // 错误处理
  if (error) {
    if (error.type === '403') {
      return (
        <Result
          status="403"
          title="无权限访问"
          subTitle="您没有访问此页面的权限，请联系管理员"
        />
      );
    }
    if (error.type === '404') {
      return (
        <Result
          status="404"
          title="页面未找到"
          subTitle={error.message || `路由 ${location.pathname} 对应的页面组件不存在`}
        />
      );
    }
    if (error.type === '500') {
      return (
        <Result
          status="500"
          title="加载失败"
          subTitle={error.message || '页面组件加载出错，请刷新重试'}
        />
      );
    }
  }

  // 加载中
  if (!Component) {
    return <PageLoading />;
  }

  // 渲染组件
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  );
};

export default DynamicRoute;
