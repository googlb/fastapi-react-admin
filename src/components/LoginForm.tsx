import { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Form } from "@heroui/react";
import { login } from '@/api/auth';
import { useNavigate } from '@tanstack/react-router';

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Use existing login API
            // Note: The API expects 'username' and 'password' in URLSearchParams usually for OAuth2, 
            // but let's check the backend. The backend `UserLogin` schema expects JSON body.
            // app/system/schemas/user.py: UserLogin (username, password)
            // app/system/api/user.py: @router.post("/login") expects UserLogin as body.
            // ui/src/api/auth.ts: login(data) posts data.

            const res = await login({ username, password });

            // Assuming res contains access_token based on backend verification
            if (res.code === 0 && res.data.access_token) {
                localStorage.setItem('token', res.data.access_token);
                navigate({ to: '/' });
            } else {
                alert('Login failed: ' + (res.msg || 'Unknown error'));
            }
        } catch (error) {
            console.error('Login error', error);
            alert('Login error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col gap-1 items-center pb-4">
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="text-small text-default-500">Enter your credentials to continue</p>
            </CardHeader>
            <CardBody>
                <Form validationBehavior="native" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        isRequired
                        label="Username"
                        placeholder="Enter your username"
                        value={username}
                        onValueChange={setUsername}
                        variant="bordered"
                    />
                    <Input
                        isRequired
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onValueChange={setPassword}
                        variant="bordered"
                    />
                    <Button color="primary" type="submit" isLoading={isLoading} className="w-full">
                        Sign In
                    </Button>
                </Form>
            </CardBody>
        </Card>
    );
};
