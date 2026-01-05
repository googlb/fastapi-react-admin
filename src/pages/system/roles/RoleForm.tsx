import { Form, Input, Modal } from 'antd';
import type { Role } from '@/types/api';

interface RoleFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Role>) => void;
  loading: boolean;
  role?: Role | null;
}

const RoleForm: React.FC<RoleFormProps> = ({ open, onCancel, onSubmit, loading, role }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <Modal
      title={role ? "编辑角色" : "添加角色"}
      open={open}
      onOk={handleSubmit}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical" initialValues={role}>
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="code"
          label="角色代码"
          rules={[{ required: true, message: '请输入角色代码!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleForm;