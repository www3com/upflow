import { addConnection, closeModal, datasourceState, updateConnection } from '@/states/datasource';
import { DatabaseConnection } from '@/types/datasource';
import { Button, Drawer, Form, Input, message, Select, Space } from 'antd';
import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';

const { Option } = Select;

const ConnectionDrawer: React.FC = () => {
  const state = useSnapshot(datasourceState);
  const [form] = Form.useForm<DatabaseConnection>();

  const isEdit = !!state.editConnection;

  useEffect(() => {
    if (state.open) {
      if (isEdit && state.editConnection) {
        // 编辑模式，填充表单数据
        form.setFieldsValue(state.editConnection);
      } else {
        // 新增模式，重置表单
        form.resetFields();
      }
    }
  }, [state.open, state.editConnection, isEdit, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (isEdit && state.editConnection) {
        // 更新
        await updateConnection(state.editConnection.id!, values);
        message.success('更新成功');
        closeModal();
      } else {
        // 新增
        await addConnection(values);
        message.success('添加成功');
        closeModal();
      }
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <Drawer
      title={isEdit ? '编辑数据库连接' : '新增数据库连接'}
      open={state.open}
      onClose={handleCancel}
      width={700}
      placement="right"
      destroyOnHidden
      extra={
        <Space>
          <Button type="primary" onClick={handleOk}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label="Key"
          name="key"
          rules={[
            { required: true, message: '请输入数据库连接 Key' },
            { max: 50, message: '数据库连接 Key 不能超过50个字符' },
            { pattern: /^[a-zA-Z0-9_-]+$/, message: '数据库连接 Key 只能包含字母、数字、下划线和横线' },
          ]}
        >
          <Input placeholder="请输入数据库连接 Key" />
        </Form.Item>
        <Form.Item
          label="名称"
          name="name"
          rules={[
            { required: true, message: '请输入数据库连接名称' },
            { max: 50, message: '连接名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入数据库连接名称" />
        </Form.Item>

        <Form.Item label="数据库类型" name="type">
          <Select placeholder="请选择数据库类型（可选）" allowClear>
            <Option value="mysql">MySQL</Option>
            <Option value="postgresql">PostgreSQL</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="连接url"
          name="url"
          rules={[
            { required: true, message: '请输入连接地址' },
            { max: 200, message: '连接地址不能超过200个字符' },
          ]}
        >
          <Input placeholder="例如: localhost:3306" />
        </Form.Item>

        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { max: 50, message: '用户名不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { max: 100, message: '密码不能超过100个字符' },
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ConnectionDrawer;
