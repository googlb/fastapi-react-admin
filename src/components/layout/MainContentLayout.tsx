import React from 'react';
import { Outlet } from '@tanstack/react-router';
import AdvancedTabs from './AdvancedTabs';

const MainContentLayout: React.FC = () => {
    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 flex-shrink-0">
                <AdvancedTabs />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white rounded-lg shadow-sm min-h-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainContentLayout;
