import React, { memo } from 'react';
import * as Icons from '@ant-design/icons';

interface DynamicIconProps {
  type: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * 动态渲染 Ant Design 图标组件
 * @param type - 图标名称，例如 "UserOutlined", "HomeOutlined"
 */
const DynamicIcon: React.FC<DynamicIconProps> = memo(({ type, ...props }) => {
  // 从 @ant-design/icons 中动态获取图标组件
  const IconComponent = (Icons as any)[type];

  // 如果找不到对应图标，返回默认图标
  if (!IconComponent) {
    return <Icons.QuestionCircleOutlined {...props} />;
  }

  return <IconComponent {...props} />;
});

DynamicIcon.displayName = 'DynamicIcon';

export default DynamicIcon;
