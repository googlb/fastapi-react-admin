import React from 'react';
import { useLocation } from 'react-router-dom';
import { Result, Card } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

/**
 * 通用占位页面 - 用于显示未实现的页面
 */
const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // 从路径中提取页面名称
  const pageName = pathname.split('/').pop() || 'Unknown';
  const formattedName = pageName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Card>
      <Result
        icon={<FileTextOutlined style={{ color: '#1890ff' }} />}
        title={`${formattedName} 页面`}
        subTitle={`当前路径: ${pathname}`}
        extra={
          <div className="text-gray-500 text-sm mt-4">
            <p>这是一个占位页面，实际功能尚未实现。</p>
            <p className="mt-2">页面路径: <code className="bg-gray-100 px-2 py-1 rounded">{pathname}</code></p>
          </div>
        }
      />
    </Card>
  );
};

export default PlaceholderPage;
