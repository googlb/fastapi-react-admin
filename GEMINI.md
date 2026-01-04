# Gemini Code Assistant Context

## Project Overview

This project is a React-based admin dashboard built with Vite, TypeScript, and Ant Design. It uses TanStack Router for file-based routing, Zustand for state management, and Tailwind CSS for styling. The application is designed to interact with a FastAPI backend.

## Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Toolkit**: Ant Design 6
- **Routing**: TanStack Router 1
- **State Management**: Zustand 5
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios

## Project Structure

```
ui/
├── src/
│   ├── api/                # API interface definitions
│   ├── components/         # Reusable components
│   ├── layouts/            # Application layouts
│   ├── pages/              # Page components
│   ├── router/             # TanStack Router configuration
│   ├── store/              # State management (Zustand)
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions (e.g., Axios instance)
├── .env                    # Environment variables
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## Building and Running

### Development

To start the development server, run:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

### Build

To create a production build, run:

```bash
pnpm build
```

The output will be in the `dist` directory.

### Linting

To check for code quality, run:

```bash
pnpm lint
```

## Development Conventions

- **API Communication**: All backend API calls are proxied through the Vite development server. The `vite.config.ts` file configures a proxy from `/api` to `http://127.0.0.1:8001`.
- **Authentication**: Authentication is handled using JWT. The token is stored in local storage and managed by a Zustand store (`src/store/authStore.ts`).
- **Routing**: The application uses TanStack Router for a type-safe and file-based routing approach. Route definitions and protection are handled in `src/router/router.tsx`.
- **Styling**: The project uses Tailwind CSS for utility-first styling, along with the Ant Design component library.
- **State Management**: Global state, particularly for authentication, is managed using Zustand.
- **File Aliases**: The `@` symbol is an alias for the `src` directory in imports.
