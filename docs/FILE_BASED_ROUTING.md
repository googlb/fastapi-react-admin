# TanStack Router File-Based Routing 文档

## 目录结构

```
ui/src/
├── routes/                    # File-Based Routing 根目录
│   ├── __root.tsx            # 根路由，提供全局 context 和 Provider
│   ├── _auth.tsx             # 认证布局路由 (pathless layout)
│   ├── index.tsx              # 首页路由
│   ├── login.tsx              # 登录页面路由 (独立于 _auth 布局)
│   ├── _auth/                # 需要认证的路由
│   │   ├── index.tsx          # Dashboard 路由
│   │   ├── profile.tsx        # 个人中心路由
│   │   ├── settings.tsx       # 设置页面路由
│   │   └── system/           # 系统管理模块
│   │       ├── users.tsx      # 用户管理路由
│   │       ├── roles.tsx      # 角色管理路由
│   │       └── menus.tsx      # 菜单管理路由
│   └── routeTree.gen.ts      # 自动生成的路由树
├── pages/                     # 页面组件 (实际 UI 实现)
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── system/
│   │   ├── Users.tsx
│   │   ├── Roles.tsx
│   │   └── Menus.tsx
│   └── user/
│       ├── Profile.tsx
│       └── Settings.tsx
├── components/
│   └── layout/
│       ├── AdvancedLayout.tsx
│       ├── MainContentLayout.tsx
│       ├── AdvancedTabs.tsx
│       └── MainLayout.tsx
└── types/
    └── router.ts             # 路由类型定义
```

## 核心特性

### 1. Context 注入

在 `__root.tsx` 中定义 RouterContext，注入 auth 状态和 queryClient：

```typescript
interface RouterContext {
  auth: ReturnType<typeof useAuthStore.getState>
  queryClient: QueryClient
}
```

### 2. 路由守卫 (Auth)

在 `_auth.tsx` 中统一处理认证检查：

```typescript
export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <MainLayout><Outlet /></MainLayout>
})
```

### 3. 懒加载 (Lazy Loading)

使用动态导入实现代码分割：

```typescript
export const Route = createFileRoute('/_auth/system/users')({
  component: () => import('@/pages/system/Users').then(m => m.default)
})
```

### 4. 类型安全的查询参数

使用 zod 验证 URL 查询参数：

```typescript
validateSearch: (search: Record<string, unknown>) => ({
  page: Number(search.page) || 1,
  pageSize: Number(search.pageSize) || 10,
  keyword: search.keyword as string || '',
})
```

### 5. 数据预加载

在 loader 中使用 React Query 预加载数据：

```typescript
export const Route = createFileRoute('/_auth/system/users')({
  loader: async ({ context, search }) => {
    const data = await context.queryClient.ensureQueryData({
      queryKey: ['users', search.page, search.pageSize, search.keyword],
      queryFn: () => fetchUsers(search)
    })
    return { data }
  },
  component: () => import('@/pages/system/Users').then(m => m.default)
})
```

## 开发命令

```bash
# 生成路由树
pnpm gen:route

# 启动开发服务器
pnpm dev

# 构建
pnpm build
```

## 迁移说明

1. 删除了手写的 `src/router/router.tsx`
2. 创建了 `src/routes/` 目录使用 File-Based Routing
3. 在 `vite.config.ts` 中启用了 `@tanstack/router-plugin`
4. 使用 `createFileRoute` 替代 `createRoute`
5. 使用 context.auth 替代 localStorage 直接读取
6. 所有需要认证的路由都放在 `_auth/` 目录下

## 最佳实践

1. **路由文件职责分离**：
   - 路由定义文件（如 `system.users.tsx`）只包含 loader、validateSearch 和 beforeLoad
   - 组件实现文件（如 `pages/system/Users.tsx`）只包含 UI 组件

2. **认证统一管理**：
   - 使用 `_auth` pathless layout 包裹所有需要认证的页面
   - 通过 context.auth 访问认证状态，不直接使用 localStorage

3. **类型安全**：
   - 使用 zod 验证查询参数
   - 使用 TypeScript 严格模式
   - 为所有路由定义明确的类型

4. **性能优化**：
   - 使用懒加载减少初始包大小
   - 使用 loader 预加载数据
   - 利用 React Query 的缓存机制
