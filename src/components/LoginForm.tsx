import { LoginForm as ProLoginForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, LayoutOutlined } from '@ant-design/icons';
import { message, theme } from 'antd';
import { useAuthStore } from '@/store/authStore';

export const LoginForm = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = async (values: any) => {
        try {
            await login({
                username: values.username,
                password: values.password
            });
            message.success('登录成功！');
            navigate('/');
        } catch (error: any) {
            console.error('Login error', error);
            message.error(error.message || '登录失败，请重试');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full">
            <ProLoginForm
                logo={<LayoutOutlined className="text-5xl" style={{ color: token.colorPrimary }} />}
                title="FastAPI Admin"
                subTitle="现代化后台管理系统"
                onFinish={handleSubmit}
                submitter={{
                    searchConfig: {
                        submitText: '登录',
                    },
                }}
            >
                <ProFormText
                    name="username"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined />,
                    }}
                    placeholder="请输入用户名"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名！',
                        },
                    ]}
                />
                <ProFormText.Password
                    name="password"
                    fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined />,
                    }}
                    placeholder="请输入密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                />
                <div className="mb-6">
                    <ProFormCheckbox noStyle name="autoLogin">
                        记住我
                    </ProFormCheckbox>
                    <a className="float-right text-blue-600 hover:text-blue-700">
                        忘记密码
                    </a>
                </div>
            </ProLoginForm>
        </div>
    );
};
