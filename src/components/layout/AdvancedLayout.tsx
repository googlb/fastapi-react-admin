import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import {
    Layout,
    Menu,
    Button,
    Breadcrumb,
    Dropdown,
    Avatar,
} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '@/store/authStore';
import { useSystemStore } from '@/store/systemStore';
import type { Menu as MenuType } from '@/api/system';

const { Header, Sider, Content } = Layout;

// Convert backend menu to Ant Design menu items
const convertMenus = (menus: MenuType[]): MenuProps['items'] => {
    return menus.map(menu => {
        const item: any = {
            key: menu.path,
            label: menu.title,
            icon: <UserOutlined />,
        };

        if (menu.children && menu.children.length > 0) {
            item.children = convertMenus(menu.children);
        }

        return item;
    });
};

const AdvancedLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { menus, fetchMenus } = useSystemStore();
    const [collapsed, setCollapsed] = useState(false);
    const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([location.pathname]);

    // Fetch menus on mount
    useEffect(() => {
        if (menus.length === 0) {
            fetchMenus();
        }
    }, [fetchMenus, menus.length]);

    // Update breadcrumb and selected menu when location changes
    useEffect(() => {
        setSelectedKeys([location.pathname]);

        const findBreadcrumb = (items: MenuType[], path: string, acc: any[] = []): any[] | null => {
            for (const item of items) {
                const current = [...acc, { title: item.title, path: item.path }];
                if (item.path === path) return current;
                if (item.children) {
                    const found = findBreadcrumb(item.children, path, current);
                    if (found) return found;
                }
            }
            return null;
        };

        const breadcrumb = findBreadcrumb(menus, location.pathname);
        if (breadcrumb) {
            setBreadcrumbItems([
                { title: <HomeOutlined />, path: '/' },
                ...breadcrumb,
            ]);
        } else {
            setBreadcrumbItems([{ title: <HomeOutlined />, path: '/' }]);
        }
    }, [menus, location.pathname]);

    const menuItems: MenuProps['items'] = convertMenus(menus);

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        navigate({ to: key });
    };

    const handleLogout = async () => {
        await logout();
        navigate({ to: '/login' });
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: '个人中心',
            onClick: () => navigate({ to: '/profile' }),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '设置',
            onClick: () => navigate({ to: '/settings' }),
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            onClick: handleLogout,
        },
    ];


    return (
        <Layout className="min-h-screen">
            {/* Left Sidebar */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={256}
                collapsedWidth={80}
                className="fixed left-0 top-0 bottom-0 z-10 h-screen overflow-auto"
            >
                <div className="h-16 flex items-center justify-center text-white font-bold border-b border-white/10">
                    <span className={collapsed ? 'text-xl' : 'text-2xl'}>
                        {collapsed ? 'FP' : 'FastAPI Admin'}
                    </span>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectedKeys}
                    onClick={handleMenuClick}
                    items={menuItems}
                    className="border-r-0"
                />
            </Sider>

            {/* Main Content Area */}
            <Layout className="ml-0">
                {/* Header */}
                <Header
                    className="flex items-center justify-between bg-white px-6 shadow-sm border-b border-gray-200"
                    style={{ padding: '0 24px 0 10px', height: 64, lineHeight: '64px', backgroundColor: '#fff' }}
                >
                    <div className="flex items-center gap-4">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            style={{ fontSize: 16, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        />
                        <Breadcrumb items={breadcrumbItems} />
                    </div>

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar
                                size="default"
                                src={user?.avatar || undefined}
                                icon={<UserOutlined />}
                            />
                            <span className="text-sm">{user?.username || 'Admin'}</span>
                        </div>
                    </Dropdown>
                </Header>

                {/* Content */}
                <Content className="m-0 p-0 overflow-auto">
                    {children || <Outlet />}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdvancedLayout;
