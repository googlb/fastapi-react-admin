import { Button, Modal, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { createUser, deleteUser, getUsers, updateUser } from '@/api/system/user';
import { getRoles } from '@/api/system/role';
import type { Role, User } from '@/types/api';
import UserForm from './UserForm';

const Users: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [formLoading, setFormLoading] = useState(false);
    const actionRef = useRef<ActionType>();

    const fetchRoles = React.useCallback(async () => {
        try {
            const response = await getRoles({ page: 1, size: 100 }); // 获取所有角色用于表单
            setRoles(response.items);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleAdd = () => {
        setEditingUser(null);
        setModalVisible(true);
    };

    const handleEdit = (record: User) => {
        setEditingUser(record);
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
                    actionRef.current?.reload();
                } catch (error) {
                    console.error('删除用户失败:', error);
                }
            },
        });
    };

    const handleFormSubmit = async (values: Partial<User>) => {
        setFormLoading(true);
        try {
            if (editingUser) {
                await updateUser(editingUser.id, values);
            } else {
                await createUser(values);
            }
            setModalVisible(false);
            actionRef.current?.reload();
            return true; // 返回 true 表示提交成功
        } catch (error) {
            console.error('操作失败:', error);
            return false; // 返回 false 表示提交失败
        } finally {
            setFormLoading(false);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingUser(null);
    };

    const columns: ProColumns<User>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            search: false,
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
            search: false,
        },
        {
            title: '角色',
            dataIndex: 'role_name',
            key: 'role_name',
            search: false,
        },
        {
            title: '状态',
            dataIndex: 'is_active',
            key: 'is_active',
            search: false,
            render: (_, record) => (
                <Tag color={record.is_active ? 'success' : 'error'}>
                    {record.is_active ? '激活' : '禁用'}
                </Tag>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            valueType: 'dateTime',
            search: false,
        },
        {
            title: '操作',
            key: 'actions',
            valueType: 'option',
            render: (_, record) => (
                <Space size="small">
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <a style={{ color: 'red' }} onClick={() => handleDelete(record.id)}>删除</a>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <ProTable<User>
                columns={columns}
                actionRef={actionRef}
                request={async (params) => {
                    const { current, pageSize, username, nickname } = params;
                    try {
                        const { items, total } = await getUsers({
                            page: current,
                            size: pageSize,
                            username,
                            nickname,
                        });
                        return {
                            data: items,
                            success: true,
                            total,
                        };
                    } catch (error) {
                        return { data: [], success: false };
                    }
                }}
                rowKey="id"
                pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                }}
                headerTitle={
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        添加用户
                    </Button>
                }
                toolBarRender={() => []}
                search={{
                    layout: 'horizontal',
                    labelWidth: 'auto',
                }}
                size="middle"
            />

            <UserForm
                open={modalVisible}
                onCancel={handleModalCancel}
                onSubmit={handleFormSubmit}
                loading={formLoading}
                user={editingUser}
                roles={roles}
            />
        </div>
    );
};

export default Users;
