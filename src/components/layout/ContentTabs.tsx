import React, { useEffect } from 'react';
import { useSystemStore } from '@/store/systemStore';
import { Tabs } from 'antd';
import { useNavigate, useLocation } from '@tanstack/react-router';
import type { Menu } from '@/api/system';

const ContentTabs: React.FC = () => {
    const { tabs, activeTabPath, setActiveTab, removeTab, addTab, menus } = useSystemStore();
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    useEffect(() => {
        // Find menu item for current path to get title
        const findMenuByPath = (items: Menu[], path: string): string | undefined => {
            for (const item of items) {
                if (item.path === path) return item.title;
                if (item.children) {
                    const found = findMenuByPath(item.children, path);
                    if (found) return found;
                }
            }
            return undefined;
        };

        const currentTitle = findMenuByPath(menus, pathname);

        if (currentTitle) {
            addTab({
                title: currentTitle,
                path: pathname,
                closable: true
            });
        } else if (pathname === '/') {
            setActiveTab('/');
        }

    }, [pathname, menus, addTab, setActiveTab]);

    const handleChange = (activeKey: string) => {
        setActiveTab(activeKey);
        navigate({ to: activeKey });
    };

    const handleEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'remove' && typeof targetKey === 'string') {
            removeTab(targetKey);
            // After removal, the store updates activeTabPath. We need to check if we need to navigate.
            // This logic is often better handled in the effect or the store, as we did before.
        }
    };

    // Sync nav helper
    useEffect(() => {
        if (activeTabPath !== pathname) {
            navigate({ to: activeTabPath });
        }
    }, [activeTabPath, navigate, pathname]);

    const items = tabs.map(tab => ({
        label: tab.title,
        key: tab.path,
        closable: tab.closable,
    }));

    return (
        <div style={{ margin: '6px 16px 0' }}>
            <Tabs
                type="editable-card"
                hideAdd
                onChange={handleChange}
                activeKey={activeTabPath}
                onEdit={handleEdit}
                items={items}
                size="small"
                tabBarStyle={{ margin: 0 }}
            />
        </div>
    );
};

export default ContentTabs;
