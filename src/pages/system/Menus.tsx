import { Table, Button, Space, Tag, Tree, Typography, Modal, Form, Input, InputNumber, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getMenus, createMenu, updateMenu, deleteMenu, getMenuTree } from '@/api/system/menu';
import type { Menu } from '@/types/api';

const { Title } = Typography;

const Menus: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [menus, setMenus] = useState<Menu[]>([]);
    const [treeData, setTreeData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
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
            title: 'Icon',
            dataIndex: 'icon',
            key: 'icon',
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
                <Tag color={type === 1 ? 'blue' : type === 2 ? 'green' : 'orange'}>
                    {type === 1 ? 'Directory' : type === 2 ? 'Menu' : 'Button'}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => (
                <Tag color={status === 1 ? 'green' : 'red'}>
                    {status === 1 ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Menu) => (
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
            const response = await getMenus({ page: 1, size: 100 });
            if (response.code === 0 && response.data) {
                setMenus(response.data.items);
            }
        } catch (error) {
            console.error('Failed to fetch menus:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenuTree = async () => {
        try {
            const response = await getMenuTree();
            if (response.code === 0 && response.data) {
                // 转换菜单数据以适应Tree组件
                const convertToTreeData = (menus: Menu[]): any[] => {
                    return menus.map(menu => ({
                        title: menu.title,
                        key: menu.id,
                        children: menu.children ? convertToTreeData(menu.children) : [],
                    }));
                };
                setTreeData(convertToTreeData(response.data));
            }
        } catch (error) {
            console.error('Failed to fetch menu tree:', error);
        }
    };

    useEffect(() => {
        fetchMenus();
        fetchMenuTree();
    }, []);

    const handleAdd = () => {
        setEditingMenu(null);
        form.resetFields();
        setModalVisible(true);
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
        if (window.confirm('Are you sure you want to delete this menu?')) {
            try {
                const response = await deleteMenu(id);
                if (response.code === 0) {
                    fetchMenus();
                    fetchMenuTree();
                } else {
                    alert(response.msg || 'Failed to delete menu');
                }
            } catch (error) {
                console.error('Failed to delete menu:', error);
                alert('Failed to delete menu');
            }
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            
            if (editingMenu) {
                // 更新菜单
                const response = await updateMenu(editingMenu.id, values);
                if (response.code === 0) {
                    setModalVisible(false);
                    form.resetFields();
                    fetchMenus();
                    fetchMenuTree();
                } else {
                    alert(response.msg || 'Failed to update menu');
                }
            } else {
                // 创建菜单
                const response = await createMenu(values);
                if (response.code === 0) {
                    setModalVisible(false);
                    form.resetFields();
                    fetchMenus();
                    fetchMenuTree();
                } else {
                    alert(response.msg || 'Failed to create menu');
                }
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
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>
                    Menu Management
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Menu
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                    <Title level={5}>Menu Tree</Title>
                    <Tree
                        showLine
                        defaultExpandAll
                        treeData={treeData}
                        style={{ background: '#fff', padding: 16 }}
                    />
                </div>
                <div>
                    <Title level={5}>Menu List</Title>
                    <Table
                        columns={columns}
                        dataSource={menus}
                        loading={loading}
                        rowKey="id"
                        pagination={{ 
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                        size="small"
                    />
                </div>
            </div>

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