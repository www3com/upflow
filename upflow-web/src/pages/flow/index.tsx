import IconFont from '@/components/icon-font';
import EditFlow from '@/pages/flow/components/edit-flow';
import EditFlowModal from '@/pages/flow/components/edit-flow-modal';
import { duplicateFlow, editFlowTag, fetchFlows, fetchTags, removeFlow, state } from '@/stores/flow';
import { Flow } from '@/types/flow';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  TagOutlined
} from '@ant-design/icons';

import {
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Segmented,
  Select,
  SelectProps,
  Space,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import styles from './styles.less';

type TagRender = SelectProps['tagRender'];
const { Search } = Input;
const { Text, Paragraph } = Typography;

const FlowListPage: React.FC = () => {
  const snap = useSnapshot(state);
  const [modalOpen, setModalOpen] = useState(false);
  const [editFlowOpen, setEditFlowOpen] = useState(false);
  const [editingFlowId, setEditingFlowId] = useState<string>('');

  useEffect(() => {
    fetchFlows();
    fetchTags();
  }, []);

  const handleDeleteFlow = useCallback((flow: Flow) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除工作流 "${flow.name}" 吗？此操作不可恢复。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await removeFlow(flow.id);
      },
    });
  }, []);

  const handleDuplicateFlow = useCallback((flow: Flow) => {
    Modal.confirm({
      title: '复制工作流',
      content: (
        <Form
          layout="vertical"
          initialValues={{ name: `${flow.name} - 副本` }}
          onFinish={async (values) => {
            await duplicateFlow(flow.id, values.name);
            Modal.destroyAll();
          }}
        >
          <Form.Item name="name" label="新工作流名称" rules={[{ required: true, message: '请输入工作流名称' }]}>
            <Input placeholder="请输入工作流名称" />
          </Form.Item>
        </Form>
      ),
      okText: '复制',
      cancelText: '取消',
      onOk: () => {
        // 表单提交在 Form.onFinish 中处理
      },
    });
  }, []);

  const handleTagsChange = useCallback(async (flowId: string, tags: string[]) => {
    await editFlowTag({ flowId, tags });
    message.success('更新标签成功');
  }, []);

  const handleEditFlow = useCallback(async (flow: Flow) => {
    setEditingFlowId(flow.id);
    setEditFlowOpen(true);
  }, []);

  const handleCloseEditFlow = useCallback(() => {
    setEditFlowOpen(false);
    setEditingFlowId('');
  }, []);

  const getDropdownItems = (flow: Flow) => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />,
    },
    {
      key: 'duplicate',
      label: '复制',
      icon: <CopyOutlined />,
      onClick: () => handleDuplicateFlow(flow),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDeleteFlow(flow),
    },
  ];

  const tagRender: TagRender = (props) => {
    return (
      <Tag icon={<TagOutlined />} closable={false}>
        {props.label}
      </Tag>
    );
  };

  return (
    <>
      <Flex vertical gap={10} style={{ margin: '5px 10px 0px 10px' }}>
        <Flex justify="space-between">
          <Segmented<string>
            block
            style={{ width: '300px' }}
            shape={'round'}
            options={['全部', '工作流', '对话流', '智能体']}
            onChange={(value) => {
              console.log(value); // string
            }}
          />
          <Space>
            <Select
              mode="tags"
              style={{ width: '200px' }}
              maxTagCount="responsive"
              placeholder="全部标签"
              loading={snap.tag.loading}
              options={(snap.tag.data && snap.tag.data?.map((tag) => ({ label: tag, value: tag }))) || []}
            />
            <Search placeholder="名称" style={{ width: 200 }} />
            <Divider type="vertical" />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              新建应用
            </Button>
            <Button icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              导入DSL文件
            </Button>
          </Space>
        </Flex>
        <Flex gap={10}>
          {snap.flow.data?.map((flow) => (
            <Card
              key={flow.id}
              hoverable
              style={{ width: '350px' }}
              styles={{ body: { padding: '10px 10px 1px 10px', height: '100%' } }}
            >
              <Flex vertical onClick={() => handleEditFlow(flow as Flow)}>
                <Flex align="center" gap={6}>
                  <IconFont type="icon-flow" style={{ fontSize: '30px' }} />
                  <Flex vertical gap={2}>
                    <Text style={{ fontSize: '14px' }}>{flow.name}</Text>
                    <Text style={{ fontSize: '12px' }} type="secondary">
                      编辑于 {dayjs(flow.updatedTime).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </Flex>
                </Flex>
                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2, tooltip: true }}
                  style={{ marginTop: '16px', minHeight: '44px' }}
                >
                  {flow.description || '暂无描述'}
                </Paragraph>
              </Flex>
              <Flex justify="space-between" align={'center'}>
                <Select
                  mode="multiple"
                  maxTagCount="responsive"
                  tagRender={tagRender}
                  style={{ flex: 1 }}
                  suffixIcon={null}
                  value={flow.tags || []}
                  onChange={(tags) => handleTagsChange(flow.id, [...tags])}
                  placeholder={
                    <Tag style={{ borderStyle: 'dashed' }}>
                      <TagOutlined style={{ marginRight: '4px' }} />
                      添加标签
                    </Tag>
                  }
                  className={styles.tagSelect}
                  options={snap.tag.data?.map((tag) => ({ label: tag, value: tag })) || []}
                />

                <Button style={{ flexShrink: 0 }} type="text" icon={<EllipsisOutlined />} />
              </Flex>
            </Card>
          ))}
        </Flex>
        <EditFlowModal visible={modalOpen} onCancel={() => setModalOpen(false)} onSuccess={() => setModalOpen(false)} />
      </Flex>

      {/* EditFlow 组件现在通过 props 控制显示状态 */}
      <EditFlow open={editFlowOpen} flowId={editingFlowId} onSave={handleCloseEditFlow} onCancel={handleCloseEditFlow} />
    </>
  );
};

export default FlowListPage;
