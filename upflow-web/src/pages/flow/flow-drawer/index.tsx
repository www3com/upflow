import { Button, Drawer, Form, Input, Space, Typography } from 'antd';
import React, { useState } from 'react';
import styles from './styles.less';

const { Title, Text } = Typography;

interface FlowDrawerProps {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  width?: string | number;
  getContainer?: false;
  placement?: 'left' | 'right' | 'top' | 'bottom';
}

const FlowDrawer: React.FC<FlowDrawerProps> = ({
  open = false,
  onClose,
  title = 'Flow Drawer',
  width = 400,
  getContainer,
  placement = 'right',
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log('Form values:', values);

      // 这里可以添加具体的业务逻辑
      // 例如：保存数据、调用 API 等

      // 模拟异步操作
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose?.();
      form.resetFields();
    } catch (error) {
      console.error('操作失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose?.();
  };

  return (
    <Drawer
      title={title}
      open={open}
      onClose={handleCancel}
      width="100%"
      placement={placement}
      getContainer={getContainer}
      className={styles.flowDrawer}
      mask={false}
      extra={
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" onClick={handleOk} loading={loading}>
            确定
          </Button>
        </Space>
      }
    >
      <div className={styles.drawerContent}>
        <Title level={4}>配置信息</Title>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: '',
            description: '',
          }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[
              { required: true, message: '请输入名称' },
              { min: 2, message: '名称至少2个字符' },
            ]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item label="描述" name="description" rules={[{ max: 200, message: '描述不能超过200个字符' }]}>
            <Input.TextArea placeholder="请输入描述信息" rows={4} showCount maxLength={200} />
          </Form.Item>
        </Form>

        <div className={styles.infoSection}>
          <Text type="secondary">这是一个可复用的 Drawer 组件，可以根据需要自定义内容和行为。</Text>
        </div>
      </div>
    </Drawer>
  );
};

export default FlowDrawer;
