import { Table, Button, Space, Tag, Typography, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '@/api/system/role';
import type { Role } from '@/types/api';

const { Title } = Typography;

const Roles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Role Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
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
            render: (_: any, record: Role) => (
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

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await getRoles({ page: 1, size: 100 });
            setRoles(response.items);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleAdd = () => {
        setEditingRole(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        form.setFieldsValue(role);
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                await deleteRole(id);
                fetchRoles();
            } catch (error) {
                console.error('Failed to delete role:', error);
                alert('Failed to delete role');
            }
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            
            if (editingRole) {
                // 更新角色
                await updateRole(editingRole.id, values);
                setModalVisible(false);
                form.resetFields();
                fetchRoles();
            } else {
                // 创建角色
                await createRole(values);
                setModalVisible(false);
                form.resetFields();
                fetchRoles();
            }
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingRole(null);
        form.resetFields();
    };

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>
                    Role Management
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Role
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={roles}
                loading={loading}
                rowKey="id"
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
            />
            
            <Modal
                title={editingRole ? "Edit Role" : "Add Role"}
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Role Name"
                        rules={[{ required: true, message: 'Please input role name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="Role Code"
                        rules={[{ required: true, message: 'Please input role code!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
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

export default Roles;