# 前端布局使用指南

## 功能特性

本项目实现了一个完整的企业级后台管理系统布局，包含以下核心功能：

### 1. 左侧动态菜单
- 从 FastAPI 后端动态获取菜单数据
- 支持多级菜单嵌套
- 点击菜单项自动跳转到对应路由
- 菜单项支持折叠/展开

### 2. 可折叠侧边栏
- 点击顶部折叠按钮可切换侧边栏状态
- 折叠时显示简化的 Logo
- 平滑的过渡动画效果

### 3. 右侧标签页系统
- 支持同时打开多个菜单项
- 标签页可自由切换和关闭
- 关闭当前标签页时自动切换到相邻标签页
- Dashboard 标签页不可关闭

### 4. 面包屑导航
- 在顶部显示当前路由的完整路径
- 支持点击面包屑项进行导航
- 动态更新基于当前路由

### 5. 用户信息展示
- 右上角显示用户头像和用户名
- 支持下拉菜单（个人中心、设置、退出登录）
- 响应式设计

## 组件结构

```
src/components/layout/
├── AdvancedLayout.tsx      # 主布局（侧边栏 + 顶部导航）
├── AdvancedTabs.tsx        # 标签页组件
└── MainContentLayout.tsx   # 内容区域布局
```

## 使用说明

### 1. 菜单数据格式

后端返回的菜单数据应遵循以下格式：

```typescript
interface Menu {
    id: number;
    parent_id: number | null;
    title: string;
    path: string;
    name: string;
    component: string;
    icon: string;
    sort: number;
    menu_type: number;
    hidden?: boolean;
    children?: Menu[];
}
```

### 2. 添加新页面

1. 在 `src/pages/` 创建新页面组件
2. 在 `src/router/router.tsx` 添加路由配置
3. 确保后端返回对应的菜单数据

示例：

```typescript
// 1. 创建页面组件
// src/pages/Profile.tsx
import React from 'react';
const Profile = () => <div>Profile Page</div>;
export default Profile;

// 2. 添加路由
// src/router/router.tsx
import Profile from '@/pages/Profile';

const profileRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: '/system/profile',
    component: Profile,
});

// 添加到路由树
dashboardRoute.addChildren([
    indexRoute,
    usersRoute,
    rolesRoute,
    menusRoute,
    profileRoute, // 添加新路由
]);
```

### 3. 标签页管理

标签页状态由 `useSystemStore` 管理，提供以下方法：

```typescript
const {
    tabs,           // 当前打开的标签页列表
    activeTabPath,  // 当前激活的标签页路径
    addTab,         // 添加标签页
    removeTab,      // 移除标签页
    setActiveTab,   // 设置激活的标签页
    clearAllTabs,   // 清空所有标签页（保留 Dashboard）
    clearOtherTabs, // 关闭其他标签页
} = useSystemStore();
```

### 4. 菜单图标

当前实现使用 `UserOutlined` 作为默认图标。如果需要自定义图标：

1. 从 `@ant-design/icons` 导入所需图标
2. 在 `AdvancedLayout.tsx` 的 `convertMenus` 函数中添加图标映射逻辑

示例：

```typescript
import {
    UserOutlined,
    SettingOutlined,
    DashboardOutlined,
    TeamOutlined,
} from '@ant-design/icons';

const iconMap: Record<string, React.ReactNode> = {
    'SettingOutlined': <SettingOutlined />,
    'UserOutlined': <UserOutlined />,
    'DashboardOutlined': <DashboardOutlined />,
    'TeamOutlined': <TeamOutlined />,
};

const convertMenus = (menus: MenuType[]): MenuProps['items'] => {
    return menus.map(menu => {
        const item: any = {
            key: menu.path,
            label: menu.title,
            icon: iconMap[menu.icon] || <UserOutlined />,
        };
        // ...
    });
};
```

## API 接口

### 获取当前用户菜单

**接口地址**：`GET /api/v1/sys/menus/me`

**请求头**：
```
Authorization: Bearer {token}
```

**响应格式**：
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "parent_id": null,
      "title": "System Management",
      "path": "/system",
      "name": "System",
      "component": "Layout",
      "icon": "SettingOutlined",
      "sort": 1,
      "menu_type": 1,
      "hidden": false,
      "children": [
        {
          "id": 2,
          "parent_id": 1,
          "title": "User Management",
          "path": "/system/users",
          "name": "User",
          "component": "/system/users/index",
          "icon": "UserOutlined",
          "sort": 1,
          "menu_type": 2,
          "hidden": false
        }
      ]
    }
  ]
}
```

## 样式定制

### 主题色

在 `vite.config.ts` 中配置代理：

```typescript
server: {
    proxy: {
        '/api': {
            target: 'http://127.0.0.1:8001',
            changeOrigin: true,
        },
    },
},
```

### 布局样式

主要布局样式在组件内部定义，可以通过修改以下属性来自定义：

- **侧边栏宽度**：
  - 展开状态：256px
  - 折叠状态：80px

- **顶部高度**：64px

- **标签页高度**：自动适应

## 注意事项

1. **路由守卫**：所有 dashboard 下的路由都受认证保护，未登录会自动跳转到登录页

2. **标签页持久化**：当前实现标签页状态在内存中，刷新页面会重置。如需持久化，可以在 `systemStore` 中添加 `persist` 中间件

3. **菜单数据加载**：首次进入系统时会自动加载菜单数据，确保后端接口正常

4. **性能优化**：大量标签页可能会影响性能，建议限制最大打开标签页数量

## 扩展功能

### 添加全屏功能

```typescript
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

const handleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

// 在 Header 中添加按钮
<Button
    type="text"
    icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
    onClick={handleFullscreen}
/>
```

### 添加标签页右键菜单

```typescript
import { Dropdown } from 'antd';

const contextMenuItems = [
    {
        key: 'close',
        label: '关闭',
        onClick: () => removeTab(targetKey),
    },
    {
        key: 'closeOthers',
        label: '关闭其他',
        onClick: () => clearOtherTabs(targetKey),
    },
    {
        key: 'closeAll',
        label: '关闭所有',
        onClick: () => clearAllTabs(),
    },
];
```

## 故障排查

### 问题1：点击菜单后标签页不出现

**原因**：菜单路径与路由路径不匹配

**解决**：检查后端返回的 `path` 字段是否与路由配置中的 `path` 一致

### 问题2：面包屑不显示

**原因**：找不到对应的菜单项

**解决**：确保后端返回的菜单数据中包含完整的路径树

### 问题3：标签页关闭后路由未跳转

**原因**：关闭标签页时未正确更新路由

**解决**：检查 `AdvancedTabs.tsx` 中的 `handleEdit` 方法
