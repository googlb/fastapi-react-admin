import { useState } from 'react';
import { LoginForm as ProLoginForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-components';
import { login } from '@/api/auth';
import { useNavigate } from '@tanstack/react-router';
import { UserOutlined, LockOutlined, LayoutOutlined } from '@ant-design/icons';
import { message, theme } from 'antd';

export const LoginForm = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();

    // ProForm handles state internally, but we can also use formRef if needed
    // The onFinish callback receives the values directly

    const handleSubmit = async (values: any) => {
        try {
            const res = await login({
                username: values.username,
                password: values.password
            });

            if (res.code === 0 && res.data.access_token) {
                localStorage.setItem('token', res.data.access_token);
                message.success('Login successful!');
                navigate({ to: '/' });
            } else {
                message.error('Login failed: ' + (res.msg || 'Unknown error'));
            }
        } catch (error) {
            console.error('Login error', error);
            message.error('Login error');
        }
    };

    return (
        <div style={{ backgroundColor: 'white' }}>
            <ProLoginForm
                logo={<LayoutOutlined style={{ fontSize: 44, color: token.colorPrimary }} />}
                title="FastAPI Admin"
                subTitle="Best admin best practices"
                onFinish={handleSubmit}
                submitter={{
                    searchConfig: {
                        submitText: 'Sign In',
                    },
                }}
            >
                <ProFormText
                    name="username"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined />,
                    }}
                    placeholder={'Username'}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your username!',
                        },
                    ]}
                />
                <ProFormText.Password
                    name="password"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined />,
                    }}
                    placeholder={'Password'}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter your password!',
                        },
                    ]}
                />
                <div
                    style={{
                        marginBottom: 24,
                    }}
                >
                    <ProFormCheckbox noStyle name="autoLogin">
                        Remember me
                    </ProFormCheckbox>
                    <a
                        style={{
                            float: 'right',
                        }}
                    >
                        Forgot password
                    </a>
                </div>
            </ProLoginForm>
        </div>
    );
};
