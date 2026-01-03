import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">

            {/* 1. 科技网格 (降低透明度，作为肌理) */}
            <div
                className="absolute inset-0 z-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}
            />

            <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">

                {/* 主光源：电光紫 (上方偏左) - 笼罩感 */}
                <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px]
                    bg-violet-500 rounded-full
                    mix-blend-multiply filter blur-[100px] opacity-40
                    animate-blob" />

                {/* 辅光源：极客绿 (右侧居中) - 穿透感 */}
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px]
                    bg-emerald-400 rounded-full
                    mix-blend-multiply filter blur-[100px] opacity-40
                    animate-blob animation-delay-2000" />

                {/* 底光源：科技蓝 (底部偏左) - 承托感 */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px]
                    bg-blue-600 rounded-full
                    mix-blend-multiply filter blur-[100px] opacity-40
                    animate-blob animation-delay-4000" />
            </div>



            {/* 3. 内容容器 */}
            <div className="w-full max-w-lg relative z-10 px-4">
                <Outlet />
            </div>

            {/* --- 4. 底部版权信息 --- */}
            <div className="absolute bottom-6 w-full z-20">
                <div className="flex flex-col items-center justify-center space-y-1">
                    {/* 版权文字 */}
                    <div className="text-slate-400 text-sm">
                        <span className="font-semibold text-slate-500 mr-1">FastAPI Admin</span>
                        <span>© {currentYear}</span>
                    </div>

                    {/* 版本号 */}
                    <div className="text-blue-600  text-xs font-mono tracking-wider opacity-80">
                        DESIGNED FOR DEVELOPERS
                    </div>
                </div>
            </div>

        </div>
    );
};
