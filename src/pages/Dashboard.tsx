import { useEffect, useState } from 'react';
import { Card, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getUserInfo } from '@/api/auth';

const { Title } = Typography;

const Dashboard = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserInfo();
                if (res.code === 200) {
                    setUser(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <Title level={2}>Dashboard</Title>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Avatar
                                size={64}
                                src={user.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                                icon={<UserOutlined />}
                            />
                            <div>
                                <div className="text-lg font-semibold">{user.username}</div>
                                <div className="text-gray-500">{user.email || 'No email'}</div>
                            </div>
                        </div>
                    ) : (
                        <p>Loading user...</p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
