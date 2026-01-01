import { useEffect, useState } from 'react';
import { Card, CardBody, User } from "@heroui/react";
import { getUserInfo } from '@/api/auth';

export const Dashboard = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserInfo();
                if (res.code === 0) {
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
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardBody>
                        {user ? (
                            <User
                                name={user.username}
                                description={user.email || 'No email'}
                                avatarProps={{
                                    src: user.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026024d"
                                }}
                            />
                        ) : (
                            <p>Loading user...</p>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
