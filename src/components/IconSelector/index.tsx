import React, { useState, useMemo } from 'react';
import { Input, Empty } from 'antd';
import * as AntdIcons from '@ant-design/icons';
import { debounce } from 'lodash';
import DynamicIcon from '@/components/DynamicIcon';

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
}

const allIcons = Object.keys(AntdIcons)
  .filter((key) => key.endsWith('Outlined'))
  .sort();

const IconSelector: React.FC<IconSelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = useMemo(() => {
    if (!searchTerm) {
      return allIcons;
    }
    return allIcons.filter((iconName) =>
      iconName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, 300);

  const handleIconClick = (iconName: string) => {
    onSelect(iconName);
  };

  return (
    <div className="w-[480px] bg-white rounded-lg shadow-lg">
      <div className="p-3 border-b border-gray-200">
        <Input
          placeholder="搜索图标..."
          onChange={handleSearch}
          allowClear
          autoFocus
        />
      </div>
      <div className="p-3 max-h-[320px] overflow-y-auto">
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-6 gap-4">
            {filteredIcons.map((iconName) => (
              <div
                key={iconName}
                onClick={() => handleIconClick(iconName)}
                className="flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <DynamicIcon type={iconName} className="text-2xl mb-1" />
                <span className="text-xs text-gray-600 truncate text-center w-full">
                  {iconName.replace('Outlined', '')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未找到相关图标" />
        )}
      </div>
    </div>
  );
};

export default IconSelector;
