import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExpandOutlined, ShrinkOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { createMenu, updateMenu, deleteMenu, getMenuTree } from '@/api/system/menu';
import type { Menu } from '@/types/api';
import DynamicIcon from '@/components/DynamicIcon';

const Menus: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
    const [isAllExpanded, setIsAllExpanded] = useState(true);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Icon',
            dataIndex: 'icon',
            key: 'icon',
            render: (icon: string) => icon ? <DynamicIcon type={icon} /> : null,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Path',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: 'Sort',
            dataIndex: 'sort',
            key: 'sort',
        },
        {
            title: 'Type',
            dataIndex: 'menu_type',
            key: 'menu_type',
            render: (type: number) => (
                <Tag color={type === 1 ? 'processing' : type === 2 ? 'success' : 'warning'}>
                    {type === 1 ? 'Directory' : type === 2 ? 'Menu' : 'Button'}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => (
                <Tag color={status === 1 ? 'success' : 'error'}>
                    {status === 1 ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: React.ReactNode, record: Menu) => (
                <Space size="small">
                    <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button 
                        type="link" 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small"
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const fetchMenus = async () => {
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
    };

    // 递归获取所有菜单项的key
    const getAllMenuKeys = (menuList: Menu[]): React.Key[] => {
        let keys: React.Key[] = [];
        menuList.forEach(menu => {
            keys.push(menu.id);
            if (menu.children && menu.children.length > 0) {
                keys = keys.concat(getAllMenuKeys(menu.children));
            }
        });
        return keys;
    };

    useEffect(() => {
        fetchMenus();
    }, [fetchMenus]);

    const handleAdd = () => {
        setEditingMenu(null);
        form.resetFields();
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
        form.setFieldsValue({
            ...menu,
            parent_id: menu.parent_id || undefined,
        });
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

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            
            if (editingMenu) {
                // 更新菜单
                await updateMenu(editingMenu.id, values);
                setModalVisible(false);
                form.resetFields();
                fetchMenus();
            } else {
                // 创建菜单
                await createMenu(values);
                setModalVisible(false);
                form.resetFields();
                fetchMenus();
            }
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingMenu(null);
        form.resetFields();
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 8 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Menu
                </Button>
                <Button 
                    icon={isAllExpanded ? <ShrinkOutlined /> : <ExpandOutlined />} 
                    onClick={toggleExpandAll}
                >
                    {isAllExpanded ? 'Collapse All' : 'Expand All'}
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

            <Modal
                title={editingMenu ? "Edit Menu" : "Add Menu"}
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please input name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="path"
                        label="Path"
                        rules={[{ required: true, message: 'Please input path!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="component" label="Component">
                        <Input />
                    </Form.Item>
                    <Form.Item name="icon" label="Icon">
                        <Input />
                    </Form.Item>
                    <Form.Item name="parent_id" label="Parent Menu">
                        <Select 
                            placeholder="Select parent menu" 
                            allowClear
                            options={menus.map(menu => ({
                                label: menu.title,
                                value: menu.id,
                            }))}
                        >
                        </Select>
                    </Form.Item>
                    <Form.Item name="sort" label="Sort">
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="menu_type" label="Menu Type" initialValue={1}>
                        <Select>
                            <Select.Option value={1}>Directory</Select.Option>
                            <Select.Option value={2}>Menu</Select.Option>
                            <Select.Option value={3}>Button</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label="Status" initialValue={1}>
                        <Select>
                            <Select.Option value={1}>Active</Select.Option>
                            <Select.Option value={0}>Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Menus;