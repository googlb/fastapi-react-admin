# Pages目录结构重构说明

## 重构概述

将pages目录下的页面文件按功能模块进行分组管理，提高代码可维护性。

## 新的目录结构

```
ui/src/pages/
├── index.ts                    # 统一导出所有页面组件
├── Dashboard.tsx               # 仪表盘（保留在根目录）
├── Login.tsx                   # 登录页（保留在根目录）
├── auth/                      # 认证相关页面
│   └── index.ts
├── system/                     # 系统管理相关页面
│   ├── Users.tsx
│   ├── Roles.tsx
│   ├── Menus.tsx
│   └── index.ts
└── user/                      # 用户个人中心相关页面
    ├── Profile.tsx
    ├── Settings.tsx
    └── index.ts
```

## 模块划分说明

### 1. 根目录页面
- **Dashboard.tsx**: 仪表盘页面，系统首页
- **Login.tsx**: 登录页面，独立页面

### 2. system模块
系统管理相关功能页面：
- **Users.tsx**: 用户管理页面
- **Roles.tsx**: 角色管理页面
- **Menus.tsx**: 菜单管理页面

### 3. user模块
用户个人中心相关功能页面：
- **Profile.tsx**: 个人中心页面
- **Settings.tsx**: 设置页面

### 4. auth模块
认证相关页面（预留，目前为空）

## 导出方式

### 根目录 index.ts
```typescript
// Root pages
export { Dashboard } from './Dashboard';
export { Login } from './Login';

// System management pages
export { Users, Roles, Menus } from './system';

// User center pages
export { Profile, Settings } from './user';
```

### 模块内 index.ts
每个模块目录都有一个index.ts文件，统一导出该模块的所有页面组件：

**system/index.ts:**
```typescript
export { default as Users } from './Users';
export { default as Roles } from './Roles';
export { default as Menus } from './Menus';
```

**user/index.ts:**
```typescript
export { default as Profile } from './Profile';
export { default as Settings } from './Settings';
```

## 路由配置更新

重构后，路由配置的导入方式更简洁：

```typescript
// 之前：需要从不同路径导入
import Users from '@/pages/Users';
import Roles from '@/pages/Roles';
import Menus from '@/pages/Menus';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

// 现在：统一从 pages/index.ts 导入
import { Login, Dashboard, Users, Roles, Menus, Profile, Settings } from '@/pages';
```

## 优势

1. **清晰的模块划分**: 按功能域分组，职责明确
2. **易于维护**: 相关页面集中管理，修改时更快定位
3. **可扩展性**: 新增功能时只需创建对应模块目录
4. **导入简化**: 统一从pages/index.ts导入，路径更简洁
5. **团队协作**: 多人开发时减少文件冲突

## 注意事项

1. 组件导出使用`default`导出，在index.ts中使用`export { default as Name }`方式重新导出
2. 保持组件文件名与功能名称一致，便于识别
3. 新增页面时，记得在对应模块的index.ts中添加导出
4. 更新pages/index.ts，确保新页面可以被导入

## 未来扩展建议

随着项目发展，可以继续按业务领域划分更多模块：

```
pages/
├── system/          # 系统管理
├── user/            # 用户管理
├── auth/            # 认证相关
├── business/         # 业务功能
├── report/           # 报表统计
└── settings/         # 系统设置
```
