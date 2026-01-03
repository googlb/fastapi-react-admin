import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useSystemStore } from '@/store/systemStore';
import type { Menu } from '@/api/system';

interface Tab {
    key: string;
    label: string;
    closable: boolean;
}

// Find menu title by path - moved outside component to avoid dependency issues
const findMenuTitle = (items: Menu[], path: string): string | undefined => {
    for (const item of items) {
        if (item.path === path) return item.title;
        if (item.children) {
            const found = findMenuTitle(item.children, path);
            if (found) return found;
        }
    }
    return undefined;
};

const AdvancedTabs: React.FC = () => {
    const { tabs, activeTabPath, setActiveTab, removeTab, addTab, menus } = useSystemStore();
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    // Add tab when path changes
    useEffect(() => {
        if (pathname === '/') {
            setActiveTab('/');
            return;
        }

        const currentTitle = findMenuTitle(menus, pathname);

        if (currentTitle) {
            addTab({
                key: pathname,
                label: currentTitle,
                closable: true,
            });
        }

        // Update active tab
        setActiveTab(pathname);
    }, [pathname, menus, addTab, setActiveTab]);

    // Handle tab change
    const handleChange = (activeKey: string) => {
        setActiveTab(activeKey);
        navigate({ to: activeKey });
    };

    // Handle tab close
    const handleEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'remove' && typeof targetKey === 'string') {
            const { tabs, activeTabPath } = useSystemStore.getState();

            // Find the tab to remove
            const newTabs = tabs.filter(tab => tab.key !== targetKey);

            // If removing active tab, activate the next available tab
            let newActiveKey = activeTabPath;
            if (activeTabPath === targetKey) {
                const activeIndex = tabs.findIndex(tab => tab.key === targetKey);
                const newActiveIndex = activeIndex >= newTabs.length ? newTabs.length - 1 : activeIndex;
                newActiveKey = newTabs[newActiveIndex]?.key || '/';
            }

            // Update store
            removeTab(targetKey);

            // Navigate to new active tab if different
            if (newActiveKey !== activeTabPath && newActiveKey !== pathname) {
                navigate({ to: newActiveKey });
            }
        }
    };

    // Convert tabs to Ant Design format
    const items: Tab[] = tabs.map(tab => ({
        key: tab.key,
        label: tab.label,
        closable: tab.closable,
    }));

    return (
        <Tabs
            type="editable-card"
            hideAdd
            activeKey={activeTabPath}
            onChange={handleChange}
            onEdit={handleEdit}
            items={items}
            size="small"
            className="w-full"
            tabBarStyle={{ margin: 0, border: 'none' }}
        />
    );
};

export default AdvancedTabs;
