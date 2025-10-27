import { datasourceState, deleteConnection, fetchConnections, openModal } from '@/states/datasource';
import { DatabaseConnection } from '@/types/datasource';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, message, Popconfirm, Space, Table } from 'antd';
import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import ConnectionDrawer from './components/ConnectionDrawer';

const DatasourcePage: React.FC = () => {
  const state = useSnapshot(datasourceState);

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteConnection(id);
      message.success('删除成功');
    } catch (error) {
      // request.ts 已处理错误提示
      console.error('删除失败:', error);
    }
  };

  const handleEdit = (record: DatabaseConnection) => {
    openModal(record);
  };

  const handleAdd = () => {
    openModal();
  };

  const columns = [
    {
      title: '连接 Key',
      dataIndex: 'key',
      key: 'key',
      width: 120,
    },
    {
      title: '连接名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '数据库类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => type?.toUpperCase() || '-',
    },
    {
      title: '连接url',
      dataIndex: 'url',
      key: 'url',
      width: 200,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      width: 120,
      render: (password: string) => '●'.repeat(password.length),
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : '-'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: DatabaseConnection) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个数据库链接吗？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="数据库链接管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增链接
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={state.connections}
          rowKey="id"
          loading={state.loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <ConnectionDrawer />
    </div>
  );
};

export default DatasourcePage;
