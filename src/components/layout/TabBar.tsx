import React, {useEffect} from 'react';
import {Tabs, Dropdown} from 'antd';
import type {MenuProps} from 'antd';
import {
    CloseOutlined,
    CloseCircleOutlined,
    ColumnWidthOutlined,
    MoreOutlined
} from '@ant-design/icons';
import {useNavigate, useLocation} from 'react-router-dom';
import {useTabsStore} from '@/store/tabsStore';
import {useSystemStore} from '@/store/systemStore';
import type {Menu} from '@/types/api';

// 递归查找菜单标题
const findMenuTitle = (menus: Menu[], path: string): string | undefined => {
    for (const menu of menus) {
        if (menu.path === path) return menu.title;
        if (menu.children) {
            const found = findMenuTitle(menu.children, path);
            if (found) return found;
        }
    }
    return undefined;
};

const TabBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {tabs, activeTabKey, addTab, removeTab, setActiveTab, clearTabs} = useTabsStore();
    const {menus} = useSystemStore();

    // 1. 路由监听逻辑 (保持不变)
    useEffect(() => {
        const pathname = location.pathname;
        if (pathname === '/') {
            setActiveTab('/');
            return;
        }
        const title = findMenuTitle(menus, pathname);
        if (title) {
            addTab({key: pathname, label: title, closable: true});
        } else {
            addTab({key: pathname, label: pathname.split('/').pop() || pathname, closable: true});
        }
    }, [location.pathname, menus, addTab, setActiveTab]);

    // 2. 事件处理逻辑 (保持不变)
    const handleTabChange = (activeKey: string) => {
        setActiveTab(activeKey);
        navigate(activeKey);
    };

    const handleTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'remove' && typeof targetKey === 'string') {
            const targetTab = tabs.find(tab => tab.key === targetKey);
            if (targetTab?.closable) {
                removeTab(targetKey);
                if (activeTabKey === targetKey) {
                    const {activeTabKey: newActiveKey} = useTabsStore.getState();
                    if (newActiveKey !== targetKey) navigate(newActiveKey);
                }
            }
        }
    };

    // 3. 右键菜单操作逻辑 (保持不变)
    const handleCloseOthers = () => {
        const currentTab = tabs.find(tab => tab.key === activeTabKey);
        const homeTab = tabs.find(tab => tab.key === '/');
        const keepTabs = [homeTab, currentTab].filter(Boolean);
        clearTabs();
        keepTabs.forEach(tab => tab && addTab(tab));
    };

    const handleCloseRight = () => {
        const idx = tabs.findIndex(tab => tab.key === activeTabKey);
        tabs.slice(idx + 1).forEach(tab => tab.closable && removeTab(tab.key));
    };

    const handleCloseLeft = () => {
        const idx = tabs.findIndex(tab => tab.key === activeTabKey);
        tabs.slice(1, idx).forEach(tab => tab.closable && removeTab(tab.key));
    };

    const handleCloseAll = () => {
        clearTabs();
        setActiveTab('/');
        navigate('/');
    };

    const operationMenuItems: MenuProps['items'] = [
        {
            key: 'close-others',
            icon: <CloseCircleOutlined/>,
            label: '关闭其他',
            onClick: handleCloseOthers,
            disabled: tabs.filter(t => t.closable).length <= 1
        },
        {
            key: 'close-right',
            icon: <ColumnWidthOutlined/>,
            label: '关闭右侧',
            onClick: handleCloseRight,
            disabled: tabs.findIndex(t => t.key === activeTabKey) >= tabs.length - 1
        },
        {
            key: 'close-left',
            icon: <ColumnWidthOutlined className="scale-x-[-1]"/>,
            label: '关闭左侧',
            onClick: handleCloseLeft,
            disabled: tabs.findIndex(t => t.key === activeTabKey) <= 1
        },
        {type: 'divider'},
        {
            key: 'close-all',
            icon: <CloseOutlined/>,
            label: '关闭所有',
            onClick: handleCloseAll,
            disabled: tabs.filter(t => t.closable).length === 0
        },
    ];

    // 4. 构建 Tab 数据
    const items = tabs.map(tab => ({
        key: tab.key,
        label: tab.label,
        closable: tab.closable,
    }));

    // 5. 定义右侧额外内容 (这就是 Antd 原生的扩展槽)
    const OperationsSlot = (
        <Dropdown menu={{items: operationMenuItems}} placement="bottomRight" arrow>
            {/* 使用 min-w 保持按钮宽度，border-l 制作分割线 */}
            <div
                className="flex items-center justify-center w-10 h-full border-l border-gray-200 cursor-pointer hover:bg-gray-50 text-gray-600 transition-colors">
                <MoreOutlined className="text-lg"/>
            </div>
        </Dropdown>
    );

    return (
        <div className="bg-white border-b border-gray-200 ">
            <Tabs
                type="editable-card"
                hideAdd
                size="small"
                activeKey={activeTabKey}
                onChange={handleTabChange}
                onEdit={handleTabEdit}
                items={items}
                tabBarExtraContent={OperationsSlot}
                className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav-more]:!py-0 !mt-1"
            />
        </div>
    );
};

export default TabBar;
