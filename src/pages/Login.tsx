import { LoginForm } from '@/components/LoginForm';

export const Login = () => {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f0f2f5'
        }}>
            <LoginForm />
        </div>
    );
};
