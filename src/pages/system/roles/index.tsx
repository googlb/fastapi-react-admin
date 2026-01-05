import { Table, Button, Space, Tag, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '@/api/system/role';
import type { Role } from '@/types/api';
import RoleForm from './RoleForm';

const Roles: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchRoles = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await getRoles({ page: 1, size: 100 });
            setRoles(response.items);
        } catch (error) {
            console.error('Failed to fetch roles:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '角色代码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
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
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: '操作',
            key: 'actions',
            render: (_: React.ReactNode, record: Role) => (
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
        setEditingRole(null);
        setModalVisible(true);
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: '确认删除',
            content: '您确定要删除此角色吗？此操作不可恢复。',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteRole(id);
                    fetchRoles();
                } catch (error) {
                    console.error('删除角色失败:', error);
                }
            },
        });
    };

    const handleFormSubmit = async (values: Partial<Role>) => {
        try {
            if (editingRole) {
                // 更新角色
                await updateRole(editingRole.id, values);
            } else {
                // 创建角色
                await createRole(values);
            }
            setModalVisible(false);
            fetchRoles();
        } catch (error) {
            console.error('操作失败:', error);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setEditingRole(null);
    };

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    添加角色
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={roles}
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

            <RoleForm
                open={modalVisible}
                onCancel={handleModalCancel}
                onSubmit={handleFormSubmit}
                loading={loading}
                role={editingRole}
            />
        </div>
    );
};

export default Roles;