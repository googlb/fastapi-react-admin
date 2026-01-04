import { LoginForm as ProLoginForm, ProFormText, ProFormCheckbox } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, LayoutOutlined } from '@ant-design/icons';
import { message, theme } from 'antd';
import { useAuthStore } from '@/store/authStore';

export const LoginForm = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();

    // 从 Store 中获取封装好的登录业务 Action
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (values: any) => {
        try {
            // 核心优化：
            // 1. 不需要在组件里调用 loginApi
            // 2. 不需要在组件里调用 getCurrentUserInfo
            // 3. 不需要在组件里处理 snake_case 转 camelCase
            // 一切都在 store.login(values) 里自动完成了
            await login({
                username: values.username,
                password: values.password
            });

            message.success('欢迎回来！');

            // 使用 replace: true，防止用户登录后点击浏览器“后退”按钮又回到登录页
            navigate('/', { replace: true });

        } catch (error) {
            // 注意：
            // request.ts 拦截器已经处理了 API 错误（如密码错误、500错误）并弹出了 message.error
            // 这里的 catch 主要是为了捕获异常，防止 ProForm 认为提交成功了
            // ProForm 捕获到 Promise reject 后会自动停止 Loading 动画
            console.error('登录流程中断:', error);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-2 w-full max-w-md">
            <ProLoginForm
                logo={<LayoutOutlined className="text-5xl" style={{ color: token.colorPrimary }} />}
                title="FastAPI Admin"
                subTitle="现代化后台管理系统"
                onFinish={handleSubmit}
                submitter={{
                    searchConfig: {
                        submitText: '登录',
                    },
                    submitButtonProps: {
                        size: 'large',
                        style: { width: '100%' },
                    },
                }}
            >
                <ProFormText
                    name="username"
                    fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined className={'prefixIcon'} />,
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
                        prefix: <LockOutlined className={'prefixIcon'} />,
                    }}
                    placeholder="请输入密码"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}
                />
                <div className="mb-6 flex justify-between items-center">
                    <ProFormCheckbox noStyle name="autoLogin">
                        记住我
                    </ProFormCheckbox>
                    <a
                        className="text-blue-600 hover:text-blue-700 cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            message.info('请联系管理员重置密码');
                        }}
                    >
                        忘记密码？
                    </a>
                </div>
            </ProLoginForm>
        </div>
    );
};
