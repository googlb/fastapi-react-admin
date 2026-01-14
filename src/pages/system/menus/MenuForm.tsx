import { Form, Input, InputNumber, Select, Modal, Popover } from 'antd';
import type { Menu } from '@/types/api';
import React, { useState } from 'react';
import IconSelector from '@/components/IconSelector';
import DynamicIcon from '@/components/DynamicIcon';

const { Option } = Select;

interface MenuFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Menu>) => void;
  loading: boolean;
  menu?: Menu | null;
  menus: Menu[];
}

const MenuForm: React.FC<MenuFormProps> = ({ open, onCancel, onSubmit, loading, menu, menus }) => {
  const [form] = Form.useForm();
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const iconValue = Form.useWatch('icon', form);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleIconSelect = (iconName: string) => {
    form.setFieldsValue({ icon: iconName });
    setIconPickerOpen(false);
  };

  return (
    <Modal
      title={menu ? "编辑菜单" : "添加菜单"}
      open={open}
      onOk={handleSubmit}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      confirmLoading={loading}
      width={600}
      // Antd Modal默认会销毁子元素，导致form状态丢失，这里设置不销毁
      destroyOnClose={false}
    >
      <Form form={form} layout="vertical" initialValues={menu || { menu_type: 1, status: 1, sort: 0 }}>
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="path"
          label="路径"
          rules={[{ required: true, message: '请输入路径!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="component" label="组件">
          <Input />
        </Form.Item>
        <Form.Item name="icon" label="图标">
          <Popover
            content={<IconSelector onSelect={handleIconSelect} />}
            trigger="click"
            open={iconPickerOpen}
            onOpenChange={setIconPickerOpen}
            placement="bottomLeft"
          >
            <Input
              placeholder="点击选择图标"
              readOnly
              value={iconValue}
              prefix={iconValue && <DynamicIcon type={iconValue} className="mr-2" />}
            />
          </Popover>
        </Form.Item>
        <Form.Item name="parent_id" label="父级菜单">
          <Select
            placeholder="请选择父级菜单"
            allowClear
            options={menus.map(m => ({
              label: m.title,
              value: m.id,
            }))}
          />
        </Form.Item>
        <Form.Item name="sort" label="排序">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="menu_type" label="菜单类型">
          <Select>
            <Option value={1}>目录</Option>
            <Option value={2}>菜单</Option>
            <Option value={3}>按钮</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select>
            <Option value={1}>激活</Option>
            <Option value={0}>禁用</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuForm;
