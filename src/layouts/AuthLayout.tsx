import React from 'react';
import { Outlet } from 'react-router-dom';

const BackgroundBlobs = () => (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-violet-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000" />
    </div>
);

export const AuthLayout: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* 1. 网格背景 */}
            <div
                className="absolute inset-0 z-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}
            />

            {/* 2. 动态光斑 */}
            <BackgroundBlobs />

            <div className="w-full max-w-lg relative z-10 px-4">
                    <Outlet />
            </div>

            {/* 4. 底部版权 */}
            <footer className="absolute bottom-6 w-full z-20 text-center">
                <div className="text-slate-400 text-sm mb-1">
                    <span className="font-semibold text-slate-500 mr-1">FastAPI Admin</span>
                    <span>© {currentYear}</span>
                </div>
                <div className="text-blue-600 text-xs font-mono tracking-wider opacity-80">
                    DESIGNED FOR DEVELOPERS
                </div>
            </footer>
        </div>
    );
};
