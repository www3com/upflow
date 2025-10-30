import { createFlow } from '@/stores/flow';
import { Form, Input, Modal } from 'antd';
import React from 'react';

export interface EditFlowModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const EditFlowModal: React.FC<EditFlowModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await createFlow(values);
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      console.error('Create flow error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal title="新建工作流" open={visible} onOk={handleOk} onCancel={handleCancel} okText="创建" cancelText="取消">
      <Form form={form} layout="vertical" initialValues={{ name: '', description: '' }}>
        <Form.Item
          name="name"
          label="工作流名称"
          rules={[
            { required: true, message: '请输入工作流名称' },
            { max: 50, message: '名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入工作流名称" />
        </Form.Item>
        <Form.Item name="description" label="描述" rules={[{ max: 200, message: '描述不能超过200个字符' }]}>
          <Input.TextArea placeholder="请输入工作流描述（可选）" rows={3} showCount maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditFlowModal;
