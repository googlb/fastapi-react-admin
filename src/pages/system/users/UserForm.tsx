import { Form, Input, Select, Modal, Switch } from 'antd';
import type { User } from '@/types/api';
import React from 'react';



interface UserFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<User>) => Promise<boolean>;
  loading: boolean;
  user?: User | null;
  roles: { id: number; name: string }[];
}

const UserForm: React.FC<UserFormProps> = ({ open, onCancel, onSubmit, loading, user, roles }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
    } catch (error) {
      console.error('Form validation failed or submission failed:', error);
    }
  };

  React.useEffect(() => {
    if (open) {
      form.resetFields();
      if (user) {
        form.setFieldsValue(user);
      } else {
        form.setFieldsValue({
            is_active: true,
            is_superuser: false,
        })
      }
    }
  }, [open, user, form]);

  return (
    <Modal
      title={user ? "编辑用户" : "添加用户"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input disabled={!!user} />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '邮箱格式不正确!' }
          ]}
        >
          <Input />
        </Form.Item>
        {!user && (
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: !user, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item
          name="nickname"
          label="昵称"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="手机号"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="role_ids"
          label="角色"
        >
          <Select
            mode="multiple"
            placeholder="请选择角色"
            allowClear
            options={roles.map(role => ({
              label: role.name,
              value: role.id,
            }))}
          >
          </Select>
        </Form.Item>
        <Form.Item
          name="is_active"
          label="激活状态"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="is_superuser"
          label="超级用户"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="remark"
          label="备注"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;