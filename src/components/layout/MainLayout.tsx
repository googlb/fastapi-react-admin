import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from '@tanstack/react-router';
import { ProLayout, type MenuDataItem } from '@ant-design/pro-components';
import { Dropdown, ConfigProvider } from 'antd';
import { LogoutOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useSystemStore } from '@/store/systemStore';
import { useAuthStore } from '@/store/authStore';
import DynamicIcon from '@/components/DynamicIcon';
import ContentTabs from '@/components/layout/ContentTabs';

// Convert backend menu to ProLayout menu
const mapMenus = (menus: any[]): MenuDataItem[] => {
    return menus.map(menu => ({
        path: menu.path,
        name: menu.title,
        icon: menu.icon ? <DynamicIcon name={menu.icon} size={16} /> : undefined,
        hideInMenu: menu.hidden,
        routes: menu.children ? mapMenus(menu.children) : undefined,
    }));
};

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { menus, fetchMenus, isSidebarCollapsed, toggleSidebar } = useSystemStore(); // Note: toggleSidebar logic might be handled by ProLayout internal state or synced
    const { user, logout } = useAuthStore();
    const [pathname, setPathname] = useState(location.pathname);

    useEffect(() => {
        setPathname(location.pathname);
    }, [location.pathname]);

    // Ensure menus are loaded (if not already strictly handled by router loader or previous logic)
    // Assuming fetchMenus is called already or we call it here
    useEffect(() => {
        if (menus.length === 0) {
            fetchMenus();
        }
    }, [fetchMenus, menus.length]);


    const handleLogout = async () => {
        await logout();
        navigate({ to: '/login' });
    };

    return (
        <div
            id="test-pro-layout"
            style={{
                height: '100vh',
            }}
        >
            <ProLayout
                title="FastAPI Admin"
                logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                location={{
                    pathname,
                }}
                route={{
                    routes: mapMenus(menus),
                }}
                avatarProps={{
                    src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
                    size: 'small',
                    title: user?.username || 'Admin',
                    render: (props, dom) => {
                        return (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'logout',
                                            icon: <LogoutOutlined />,
                                            label: 'Logout',
                                            onClick: handleLogout,
                                        },
                                    ],
                                }}
                            >
                                {dom}
                            </Dropdown>
                        );
                    },
                }}
                menuItemRender={(item, dom) => (
                    <Link to={item.path || '/'}>
                        {dom}
                    </Link>
                )}
                layout="mix"
                splitMenus={false}
                fixSiderbar
                headerRender={(props, defaultDom) => {
                    // We can customize header here if needed, or use default
                    return defaultDom;
                }}
            // We use our custom ContentTabs followed by Outlet
            >
                <ContentTabs />
                <div style={{ height: 'calc(100vh - 100px)', overflow: 'auto' }}>
                    <Outlet />
                </div>
            </ProLayout>
        </div>
    );
};

export default MainLayout;
