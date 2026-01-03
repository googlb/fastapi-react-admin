# FastAPI React Admin

基于 FastAPI + React + TanStack Router + Ant Design 的后台管理系统模板。

## 项目特性

- ⚡ **TanStack Router v1** - File-Based Routing 架构
- 🎨 **Ant Design** - 企业级 UI 组件库
- 🔐 **认证鉴权** - 基于路由守卫的权限控制
- 📦 **代码分割** - 自动懒加载优化性能
- 🎯 **TypeScript** - 严格类型检查
- 📝 **Zustand** - 轻量级状态管理
- 🌐 **Axios** - HTTP 请求库
- 💅 **Tailwind CSS** - 原子化 CSS 框架

## 技术栈

- React 19
- TypeScript 5
- Vite 7
- TanStack Router 1
- TanStack Query 5
- Ant Design 6
- Zustand 5
- Zod 4

## 目录结构

```
ui/
├── src/
│   ├── routes/              # TanStack Router 文件系统路由
│   ├── pages/               # 页面组件
│   ├── components/          # 可复用组件
│   ├── store/              # 状态管理 (Zustand)
│   ├── api/                # API 接口定义
│   ├── utils/              # 工具函数
│   └── types/              # TypeScript 类型定义
├── docs/                  # 项目文档
│   ├── FILE_BASED_ROUTING.md  # File-Based Routing 说明
│   ├── LAYOUT_GUIDE.md        # 布局指南
│   └── PAGES_REFACTOR.md      # 页面重构说明
└── package.json
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 生成路由树
pnpm gen:route

# 构建
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint
```

## 核心文档

- [File-Based Routing 指南](docs/FILE_BASED_ROUTING.md) - 详细的路由架构说明
- [布局组件指南](docs/LAYOUT_GUIDE.md) - 布局系统的实现说明
- [页面重构文档](docs/PAGES_REFACTOR.md) - 页面模块化组织说明

## 路由系统

项目使用 TanStack Router 的 File-Based Routing 架构：

- ✅ 自动路由生成 - 基于文件系统自动生成路由
- ✅ 路由守卫 - 统一的认证和权限控制
- ✅ 懒加载 - 自动代码分割，优化首屏加载
- ✅ 类型安全 - 完整的 TypeScript 类型支持
- ✅ 查询参数验证 - 使用 Zod 验证 URL 参数

详细文档请查看 [File-Based Routing 指南](docs/FILE_BASED_ROUTING.md)。

## API 接口

前端通过 `/api` 前缀与后端通信，代理配置：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8001',
      changeOrigin: true,
    },
  },
}
```

## 认证与权限

- 使用 Zustand persist 中间件持久化 Token
- 路由级别的认证守卫（`_auth.tsx`）
- 通过 Router Context 注入认证状态
- 支持角色和权限控制

## License

MIT

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
