import { Table, Button, Space, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Users = () => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Is Active',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (is_active: boolean) => (
                <Tag color={is_active ? 'green' : 'red'}>
                    {is_active ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Is Superuser',
            dataIndex: 'is_superuser',
            key: 'is_superuser',
            render: (is_superuser: boolean) => (
                <Tag color={is_superuser ? 'blue' : 'default'}>
                    {is_superuser ? 'Yes' : 'No'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space size="small">
                    <Button type="link" icon={<EditOutlined />} size="small">
                        Edit
                    </Button>
                    <Button type="link" danger icon={<DeleteOutlined />} size="small">
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            is_active: true,
            is_superuser: true,
            created_at: '2024-01-01',
        },
        {
            key: '2',
            id: 2,
            username: 'user1',
            email: 'user1@example.com',
            is_active: true,
            is_superuser: false,
            created_at: '2024-01-02',
        },
        {
            key: '3',
            id: 3,
            username: 'user2',
            email: 'user2@example.com',
            is_active: false,
            is_superuser: false,
            created_at: '2024-01-03',
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>
                    User Management
                </Title>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add User
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
            />
        </div>
    );
};

export default Users;