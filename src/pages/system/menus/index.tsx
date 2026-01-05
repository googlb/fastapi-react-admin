import { Table, Button, Space, Tag, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExpandOutlined, ShrinkOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { createMenu, updateMenu, deleteMenu, getMenuTree } from '@/api/system/menu';
import type { Menu } from '@/types/api';
import DynamicIcon from '@/components/DynamicIcon';
import MenuForm from './MenuForm';

const Menus: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [isAllExpanded, setIsAllExpanded] = useState(true);

    // 递归获取所有菜单项的key
    const getAllMenuKeys = React.useCallback((menuList: Menu[]): React.Key[] => {
        let keys: React.Key[] = [];
        menuList.forEach(menu => {
            keys.push(menu.id);
            if (menu.children && menu.children.length > 0) {
                keys = keys.concat(getAllMenuKeys(menu.children));
            }
        });
        return keys;
    }, []);

    const fetchMenus = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await getMenuTree();
            setMenus(response);
            // 默认展开所有节点
            const allKeys = getAllMenuKeys(response);
            setExpandedRowKeys(allKeys);
            setIsAllExpanded(true);
        } catch (error) {
            console.error('Failed to fetch menus:', error);
        } finally {
            setLoading(false);
        }
    }, [getAllMenuKeys]);

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
            align: 'center' as const,
            render: (icon: string) => icon ? <DynamicIcon type={icon} /> : null,
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
            align: 'center' as const,
        },
        {
            title: '类型',
            dataIndex: 'menu_type',
            key: 'menu_type',
            render: (type: number) => (
                <Tag color={type === 1 ? 'processing' : type === 2 ? 'success' : 'warning'}>
                    {type === 1 ? '目录' : type === 2 ? '菜单' : '按钮'}
                </Tag>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => (
                <Tag color={status === 1 ? 'success' : 'error'}>
                    {status === 1 ? '激活' : '禁用'}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'actions',
            align: 'center' as const,
            render: (_: React.ReactNode, record: Menu) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDelete(record.id)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingMenu(null);
        setModalVisible(true);
    };

    const toggleExpandAll = () => {
        if (isAllExpanded) {
            // 收起所有
            setExpandedRowKeys([]);
            setIsAllExpanded(false);
        } else {
            // 展开所有
            const allKeys = getAllMenuKeys(menus);
            setExpandedRowKeys(allKeys);
            setIsAllExpanded(true);
        }
    };

    const handleEdit = (menu: Menu) => {
        setEditingMenu(menu);
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: '确认删除',
            content: '您确定要删除此菜单吗？此操作不可恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteMenu(id);
                    fetchMenus();
                } catch (error) {
                    console.error('删除菜单失败:', error);
                }
            },
        });
    };

    const handleFormSubmit = async (values: Partial<Menu>) => {
        try {
            if (editingMenu) {
                // 更新菜单
                await updateMenu(editingMenu.id, values);
            } else {
                // 创建菜单
                await createMenu(values);
            }
            setModalVisible(false);
            fetchMenus();
        } catch (error) {
            console.error('操作失败:', error);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingMenu(null);
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 8 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    添加菜单
                </Button>
                <Button
                    icon={isAllExpanded ? <ShrinkOutlined /> : <ExpandOutlined />}
                    onClick={toggleExpandAll}
                >
                    {isAllExpanded ? '全部收起' : '全部展开'}
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={menus}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
                expandable={{
                    expandedRowKeys,
                    onExpandedRowsChange: (expandedKeys: readonly React.Key[]) => {
                        setExpandedRowKeys([...expandedKeys]);
                        setIsAllExpanded(expandedKeys.length === getAllMenuKeys(menus).length);
                    },
                    childrenColumnName: 'children',
                }}
                size="middle"
            />

            <MenuForm
                open={modalVisible}
                onCancel={handleModalCancel}
                onSubmit={handleFormSubmit}
                loading={loading}
                menu={editingMenu}
                menus={menus}
            />
        </div>
    );
};

export default Menus;
