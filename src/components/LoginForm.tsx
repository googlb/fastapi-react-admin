import { LoginForm as ProLoginForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, LayoutOutlined } from '@ant-design/icons';
import { message, theme } from 'antd';
import { useAuthStore } from '@/store/authStore';
import { login as loginApi } from '@/api/auth';
import { getCurrentUserInfo } from '@/api/system/user';
import type { LoginResponse } from '@/types/api';

export const LoginForm = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    // 从 store 中获取 login action
    const { login: loginAction } = useAuthStore();

    const handleSubmit = async (values: any) => {
        try {
            // 1. 调用 API 进行登录
            const loginRes = await loginApi({
                username: values.username,
                password: values.password
            });

            // loginRes 现在是 response.data
            const { access_token, refresh_token } = loginRes.data as LoginResponse;
            
            // 2. 获取当前用户信息
            const userRes = await getCurrentUserInfo();
            const user = userRes.data;

            // 3. 调用 store action，将 tokens 和 user 信息存入 state
            if (user) {
                 loginAction({ accessToken: access_token, refreshToken: refresh_token }, user);
                 message.success('登录成功！');
                 navigate('/');
            } else {
                 throw new Error('获取用户信息失败');
            }

        } catch (error: any) {
            console.error('Login error', error);
            // API 错误信息已在 request.ts 拦截器中全局提示，此处可选择性补充
            // message.error(error.message || '登录失败，请重试');
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
                    // onFinish 会自动处理 loading 状态
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
