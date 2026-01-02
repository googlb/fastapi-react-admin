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
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full">
            <ProLoginForm
                    logo={<LayoutOutlined className="text-5xl" style={{ color: token.colorPrimary }} />}
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
                    <div className="mb-6">
                        <ProFormCheckbox noStyle name="autoLogin">
                            Remember me
                        </ProFormCheckbox>
                        <a className="float-right text-blue-600 hover:text-blue-700">
                            Forgot password
                        </a>
                    </div>
                </ProLoginForm>
        </div>
    );
};
