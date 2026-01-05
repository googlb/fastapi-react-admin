import { Table, Button, Space, Modal, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '@/api/system/user';
import { getRoles } from '@/api/system/role';
import type { User } from '@/types/api';
import UserForm from './UserForm';

const Users: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await getUsers({ page: 1, size: 100 });
            setUsers(response.items);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRoles = React.useCallback(async () => {
        try {
            const response = await getRoles({ page: 1, size: 100 });
            setRoles(response.items);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [fetchUsers, fetchRoles]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '角色',
            dataIndex: 'role_name',
            key: 'role_name',
        },
        {
            title: '状态',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'success' : 'error'}>
                    {isActive ? '激活' : '禁用'}
                </Tag>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: '操作',
            key: 'actions',
            render: (_: React.ReactNode, record: User) => (
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
        setEditingUser(null);
        setModalVisible(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: '确认删除',
            content: '您确定要删除此用户吗？此操作不可恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteUser(id);
                    fetchUsers();
                } catch (error) {
                    console.error('删除用户失败:', error);
                }
            },
        });
    };

    const handleFormSubmit = async (values: Partial<User>) => {
        try {
            if (editingUser) {
                // 更新用户
                await updateUser(editingUser.id, values);
            } else {
                // 创建用户
                await createUser(values);
            }
            setModalVisible(false);
            fetchUsers();
        } catch (error) {
            console.error('操作失败:', error);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingUser(null);
    };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    添加用户
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
                size="middle"
            />

            <UserForm
                open={modalVisible}
                onCancel={handleModalCancel}
                onSubmit={handleFormSubmit}
                loading={loading}
                user={editingUser}
                roles={roles}
            />
        </div>
    );
};

export default Users;
