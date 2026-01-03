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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status}
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
            status: 'active',
            created_at: '2024-01-01',
        },
        {
            key: '2',
            id: 2,
            username: 'user1',
            email: 'user1@example.com',
            status: 'active',
            created_at: '2024-01-02',
        },
        {
            key: '3',
            id: 3,
            username: 'user2',
            email: 'user2@example.com',
            status: 'inactive',
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
                pagination={{
                    current: 1,
                    pageSize: 10,
                    total: 3,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
            />
        </div>
    );
};

export default Users;
