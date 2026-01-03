import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { AuthLayout } from '@/layouts/AuthLayout';
import MainLayout from '@/components/layout/MainLayout';
import { Login, Dashboard, Users, Roles, Menus, Profile, Settings } from '@/pages';

// Root route
const rootRoute = createRootRoute({
    component: Outlet,
});

// Auth Layout Route
const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'auth',
    component: AuthLayout,
});

// Login Route
const loginRoute = createRoute({
    getParentRoute: () => authRoute,
    path: 'login',
    component: Login,
    beforeLoad: () => {
        if (localStorage.getItem('token')) {
            throw redirect({ to: '/' });
        }
    }
});

// Dashboard Layout Route (Protected)
const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'dashboard',
    component: MainLayout,
    beforeLoad: ({ location }) => {
        if (!localStorage.getItem('token')) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
});

// Dashboard Index Route
const indexRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: '/',
    component: Dashboard,
});

// Users Route
const usersRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: '/system/users',
    component: Users,
});

// Roles Route
const rolesRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: '/system/roles',
    component: Roles,
});

// Menus Route
const menusRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: '/system/menus',
    component: Menus,
});

// Profile Route
const profileRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: '/profile',
    component: Profile,
});

// Settings Route
const settingsRoute = createRoute({
    getParentRoute: () => dashboardRoute,
    path: '/settings',
    component: Settings,
});

const routeTree = rootRoute.addChildren([
    authRoute.addChildren([loginRoute]),
    dashboardRoute.addChildren([
        indexRoute,
        usersRoute,
        rolesRoute,
        menusRoute,
        profileRoute,
        settingsRoute,
    ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}
