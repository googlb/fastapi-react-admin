# 实施计划：重构认证状态管理

## Phase 1: 设置 Zustand 存储

-   [x] Task: 安装 `zustand` 和 `zustand/middleware`（如果尚未安装）。
-   [ ] Task: 创建 `src/store/authStore.ts` 文件。
-   [ ] Task: **编写测试** - 为 `useAuthStore` 的 `setToken` 和 `clearAuth` 等核心操作编写单元测试。
-   [ ] Task: **实现代码** - 定义 `useAuthStore` 的 state（状态）和 actions（操作），并集成 `persist` 中间件以将状态持久化到 `localStorage`，确保测试通过。
-   [ ] Task: Conductor - User Manual Verification 'Phase 1: 设置 Zustand 存储' (Protocol in workflow.md)

## Phase 2: 重构应用入口和路由守卫

-   [ ] Task: **编写测试** - 为 `ProtectedRoute` 编写测试，模拟未登录和已登录状态，验证其重定向逻辑。
-   [ ] Task: **实现代码** - 重构 `ProtectedRoute` 和 `PublicRoute`，使其从 `useAuthStore` 读取认证状态，而不是直接访问 `localStorage`，确保测试通过。
-   [ ] Task: **编写测试** - 为 `LoginForm` 或相关登录/登出组件编写测试，验证其调用 `useAuthStore` 的操作。
-   [ ] Task: **实现代码** - 重构登录/登出逻辑，使其调用 `useAuthStore` 中的 `setToken` 和 `clearAuth` 操作，确保测试通过。
-   [ ] Task: Conductor - User Manual Verification 'Phase 2: 重构应用入口和路由守卫' (Protocol in workflow.md)

## Phase 3: 重构数据请求逻辑

-   [ ] Task: **编写测试** - 编写一个模拟测试来验证 Axios 请求拦截器是否能从 `useAuthStore` 中获取 token 并正确地添加到 `Authorization` 请求头中。
-   [ ] Task: **实现代码** - 修改 Axios 实例和请求拦截器，使其使用 `useAuthStore.getState().token` 来获取认证令牌，确保测试通过。
-   [ ] Task: Conductor - User Manual Verification 'Phase 3: 重构数据请求逻辑' (Protocol in workflow.md)

## Phase 4: 实现跨标签页状态同步

-   [ ] Task: **编写测试** - 编写测试来验证当 `localStorage` 发生变化时，`useAuthStore` 的状态是否会相应地更新。
-   [ ] Task: **实现代码** - 利用 `storage` 事件监听器或 `BroadcastChannel` API 来实现跨标签页的状态同步。当一个标签页登出（清除 `localStorage`）时，其他标签页应能监听到变化并同步更新其 `useAuth-Store` 状态，确保测试通过。
-   [ ] Task: Conductor - User Manual Verification 'Phase 4: 实现跨标签页状态同步' (Protocol in workflow.md)

## Phase 5: 清理和最终验证

-   [ ] Task: 在整个项目中进行全局搜索，查找并移除所有剩余的对 `localStorage` 的直接读写操作。
-   [ ] Task: 手动端到端测试完整的认证流程：登录、登出、刷新页面、访问受保护路由、令牌过期处理以及跨标签页同步。
-   [ ] Task: Conductor - User Manual Verification 'Phase 5: 清理和最终验证' (Protocol in workflow.md)
