# 轨道规范：重构认证状态管理

## 1. 概述

当前项目中存在大量直接操作 `localStorage` 的代码用于认证状态管理。此轨道的目标是根据 2026 年的最佳实践，将此逻辑重构为使用 `Zustand` 及其 `persist` 中间件，以实现统一、健壮且可维护的状态管理。

## 2. 功能需求

1.  **移除 `localStorage` 直接操作:**
    -   必须从代码库中完全移除所有对 `localStorage.getItem('access_token')` 和 `localStorage.setItem(...)` 的直接调用。

2.  **统一状态管理:**
    -   使用 `Zustand` 创建一个 `useAuthStore`。
    -   使用 `persist` 中间件将认证状态（包括 `accessToken`、`refreshToken` 和用户信息）持久化到 `localStorage`。

3.  **重构路由守卫:**
    -   修改 `ProtectedRoute` 和 `PublicRoute`（或类似的组件）。
    -   路由守卫逻辑必须从 `useAuthStore` 获取认证状态，而不是直接读取 `localStorage`。

4.  **重构 Axios 拦截器:**
    -   修改 `axios` 请求拦截器。
    -   拦截器必须从 `useAuthStore` 的状态中获取 `accessToken` 并将其添加到请求头中。应使用 `store.getState()` 的方式来处理异步和闭包问题。

5.  **应用启动逻辑:**
    -   实现应用启动时从持久化存储中恢复登录状态的逻辑。`Zustand` 的 `persist` 中间件会自动处理此项。

6.  **多标签页同步:**
    -   实现当一个浏览器标签页登录或登出时，其他打开的标签页应同步更新其认证状态的功能。

## 3. 非功能性需求

-   **健壮性:** 方案必须稳定可靠，能处理 token 刷新等扩展场景。
-   **可维护性:** 新的代码结构应清晰，易于理解和未来扩展。
-   **生产级标准:** 整体实现需符合生产环境下的后台管理平台标准。

## 4. 验收标准

-   代码中不再有任何直接调用 `localStorage` 进行认证管理的地方。
-   登录、登出功能正常，并且状态由 `useAuthStore` 管理。
-   路由守卫能根据 `useAuthStore` 中的状态正确地允许或拒绝访问。
-   所有需要认证的 API 请求头中都正确地包含了来自 `useAuthStore` 的 `accessToken`。
-   关闭并重新打开浏览器后，如果 token 未过期，用户应保持登录状态。
-   在一个标签页中登出，其他标签页应自动登出或重定向到登录页。

## 5. 范围之外

-   本次重构不涉及 UI/UX 的变更。
-   本次重构不涉及后端认证逻辑的修改。
