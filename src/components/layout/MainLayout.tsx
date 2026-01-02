import React from 'react';
import AdvancedLayout from './AdvancedLayout';
import MainContentLayout from './MainContentLayout';

const MainLayout: React.FC = () => {
    return (
        <AdvancedLayout>
            <MainContentLayout />
        </AdvancedLayout>
    );
};

export default MainLayout;
