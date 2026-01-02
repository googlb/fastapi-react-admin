import { Outlet } from '@tanstack/react-router';
import { Layout, Menu, Button, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content, Sider } = Layout;

export const DashboardLayout = () => {
    const items: MenuProps['items'] = [
        {
            key: 'dashboard',
            label: 'Dashboard',
        },
        {
            key: 'users',
            label: 'Users',
        },
    ];

    const handleLogout = () => {
        // TODO: Implement logout logic
        console.log('Logout clicked');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} theme="dark">
                <div style={{ height: 32, margin: 16, color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                    FastAPI Admin
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={items}
                />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Dashboard
                    </Typography.Title>
                    <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Header>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
