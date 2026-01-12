import { Form } from 'antd';
import type { User } from '@/types/api';
import React from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';

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

  React.useEffect(() => {
    if (open) {
      form.resetFields();
      if (user) {
        form.setFieldsValue(user);
      } else {
        form.setFieldsValue({
          is_active: true,
          is_superuser: false,
        });
      }
    }
  }, [open, user, form]);

  return (
    <ModalForm
      title={user ? '编辑用户' : '添加用户'}
      open={open}
      form={form}
      grid={true}
      onOpenChange={(visible) => {
        if (!visible) {
          onCancel();
        }
      }}
      onFinish={onSubmit}
      modalProps={{
        destroyOnClose: true,
        confirmLoading: loading,
      }}
      width={600}
    >
      <ProFormText
        name="username"
        label="用户名"
        colProps={{ span: 12 }}
        rules={[{ required: true, message: '请输入用户名!' }]}
        disabled={!!user}
      />
      <ProFormText
        name="nickname"
        label="昵称"
        colProps={{ span: 12 }}
      />
      <ProFormText
        name="email"
        label="邮箱"
        colProps={{ span: 12 }}
        rules={[
          { required: true, message: '请输入邮箱!' },
          { type: 'email', message: '邮箱格式不正确!' },
        ]}
      />
      <ProFormText
        name="phone"
        label="手机号"
        colProps={{ span: 12 }}
      />
      {!user && (
        <ProFormText.Password
          name="password"
          label="密码"
          colProps={{ span: 24 }}
          rules={[{ required: !user, message: '请输入密码!' }]}
        />
      )}
      <ProFormSelect
        name="role_ids"
        label="角色"
        mode="multiple"
        placeholder="请选择角色"
        colProps={{ span: 24 }}
        options={roles.map((role) => ({
          label: role.name,
          value: role.id,
        }))}
      />
      <ProFormSwitch name="is_active" label="激活状态" colProps={{ span: 12 }} />
      <ProFormSwitch name="is_superuser" label="超级用户" colProps={{ span: 12 }} />
      <ProFormTextArea name="remark" label="备注" colProps={{ span: 24 }} />
    </ModalForm>
  );
};

export default UserForm;