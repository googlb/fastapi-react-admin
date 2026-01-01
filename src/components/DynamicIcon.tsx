import React, { memo } from 'react';
import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
    name: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = memo(({ name, ...props }) => {
    const IconComponent = (Icons as any)[name];

    if (!IconComponent) {
        return <Icons.CircleHelp {...props} />;
    }

    return <IconComponent {...props} />;
});

export default DynamicIcon;
