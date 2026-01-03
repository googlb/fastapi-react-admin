import { Table, Button, Space, Tag, Tree, Typography, Modal, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

const Menus: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === '1' ? 'green' : 'red'}>
                    {status === '1' ? 'Active' : 'Inactive'}
                </Tag>
            ),
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

    const treeData = [
        {
            title: 'System Management',
            key: '1',
            children: [
                {
                    title: 'User Management',
                    key: '1-1',
                },
                {
                    title: 'Role Management',
                    key: '1-2',
                },
                {
                    title: 'Menu Management',
                    key: '1-3',
                },
            ],
        },
    ];

    const data = [
        {
            key: '1',
            id: 1,
            title: 'System Management',
            path: '/system',
            icon: 'SettingOutlined',
            sort: 1,
            status: '1',
        },
        {
            key: '2',
            id: 2,
            title: 'User Management',
            path: '/system/users',
            icon: 'UserOutlined',
            sort: 1,
            status: '1',
        },
        {
            key: '3',
            id: 3,
            title: 'Role Management',
            path: '/system/roles',
            icon: 'KeyOutlined',
            sort: 2,
            status: '1',
        },
    ];

    const handleAdd = () => {
        setModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            console.log('Form values:', values);
            setModalVisible(false);
            form.resetFields();
        });
    };

    const handleModalCancel = () => {
        setModalVisible(false);
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
                        dataSource={data}
                        pagination={false}
                        size="small"
                    />
                </div>
            </div>

            <Modal
                title="Add Menu"
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
                        name="path"
                        label="Path"
                        rules={[{ required: true, message: 'Please input path!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="icon" label="Icon">
                        <Input />
                    </Form.Item>
                    <Form.Item name="sort" label="Sort">
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Menus;
