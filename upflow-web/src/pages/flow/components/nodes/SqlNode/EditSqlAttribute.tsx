import React, { useEffect, useMemo } from 'react';
import { Button, Card, Flex, Form, Input, List, Select, Space, theme } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import VariableAvailableSelect from '@/components/VariableAvailableSelect';
import { getAvailableVariablesWithNode } from '@/pages/flow/variables';
import { useSnapshot } from 'valtio';
import { state } from '@/states/flow';
import MonacoEditor from '@/components/MonacoEditor';
import { EdgeType, NodeType, SqlNodeType } from '@/types/flow';
import { VARIABLE_TYPES } from '@/utils/constants';

const { useToken } = theme;

interface SqlNodeProps {
  node: NodeType<SqlNodeType>;
  onChange: (node: NodeType<SqlNodeType>) => void;
}

export default ({ node, onChange }: SqlNodeProps) => {
  const flowState = useSnapshot(state);
  const { token } = useToken();
  const [form] = Form.useForm();

  // 初始化表单数据
  useEffect(() => {
    const nodeData = node.data as SqlNodeType;
    const initialValues = {
      input: nodeData.input || [],
      content: nodeData.content || '',
      output: [
        { type: nodeData.output?.[0]?.type || 'ARRAY_OBJECT' }, // rows 变量
        { type: 'INTEGER' }, // rowNum 变量，固定为整形
      ],
    };
    form.setFieldsValue(initialValues);
  }, [node.data, form]);

  // 表单值变化处理
  const onValuesChange = (changedValues: any, allValues: any) => {
    const updatedData = {
      ...node.data,
      input: allValues.input || [],
      content: allValues.content || '',
      output: [
        {
          id: 'rows',
          name: 'rows',
          type: allValues.output?.[0]?.type || 'ARRAY_OBJECT',
          value: '',
        },
        {
          id: 'rowNum',
          name: 'rowNum',
          type: 'INTEGER',
          value: '',
        },
      ],
    } as SqlNodeType;

    const updatedNode = {
      ...node,
      data: updatedData,
    };

    onChange(updatedNode);
  };

  // 获取可用变量列表
  const variablesWithNode = useMemo(() => {
    return getAvailableVariablesWithNode(node.id, flowState.nodes as NodeType<SqlNodeType>[], flowState.edges as EdgeType<any>[]);
  }, [node.id, flowState.nodes, flowState.edges]);

  return (
    <Form form={form} onValuesChange={onValuesChange} layout="vertical">
      <Flex align="center" justify={'center'} vertical>
        {/* 输入变量 */}
        <Form.List name="input">
          {(fields, { add, remove }) => (
            <Card
              title="输入变量"
              style={{ width: '100%', boxShadow: 'none' }}
              size="small"
              variant="borderless"
              extra={<Button type="text" icon={<PlusOutlined />} size="small" onClick={() => add({ name: '', value: undefined })} />}
            >
              {fields.length > 0 ? (
                <List
                  size="small"
                  bordered={false}
                  split={false}
                  dataSource={fields}
                  renderItem={(field) => (
                    <List.Item key={field.key} style={{ padding: '2px 0' }}>
                      <Flex style={{ width: '100%' }} gap={8} align="center">
                        <Form.Item {...field} name={[field.name, 'name']} style={{ marginBottom: 0, flex: 1 }}>
                          <Input placeholder="变量名" />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'value']} style={{ marginBottom: 0, flex: 2 }}>
                          <VariableAvailableSelect variablesWithNode={variablesWithNode} placeholder="选择变量值" />
                        </Form.Item>
                        <Button
                          type="text"
                          icon={<DeleteOutlined style={{ color: token.colorPrimary }} />}
                          size="small"
                          onClick={() => remove(field.name)}
                        />
                      </Flex>
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ padding: '16px 0', textAlign: 'center', color: '#999', fontSize: '12px' }}>暂无输入变量，点击右上角按钮添加</div>
              )}
            </Card>
          )}
        </Form.List>

        {/* 脚本编辑框 */}
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadius,
          }}
        >
          <Form.Item name="content" style={{ marginBottom: 0 }}>
            <MonacoEditor language="sql" placeholder="请输入sql..." height={400} />
          </Form.Item>
        </div>

        {/* 输出变量 - rows 可选择类型，rowNum 固定 */}
        <Card title="输出变量" style={{ width: '100%', boxShadow: 'none' }} size="small" variant="borderless">
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {/* rows 变量 - 类型可选择 */}
            <Flex style={{ width: '100%' }} gap={8} align="center">
              <div style={{ flex: 2, fontWeight: 500 }}>rows</div>
              <div style={{ flex: 1 }}>
                <Form.Item name={['output', 0, 'type']} style={{ marginBottom: 0 }}>
                  <Select size="small" options={VARIABLE_TYPES} placeholder="选择类型" />
                </Form.Item>
              </div>
              <div style={{ flex: 2, color: token.colorTextTertiary, fontSize: '12px' }}>SQL查询结果行数据</div>
            </Flex>

            {/* rowNum 变量 - 固定为 int 类型 */}
            <Flex style={{ width: '100%' }} gap={8} align="center">
              <div style={{ flex: 2, fontWeight: 500 }}>rowNum</div>
              <div style={{ flex: 1, color: token.colorTextSecondary }}>整形</div>
              <div style={{ flex: 2, color: token.colorTextTertiary, fontSize: '12px' }}>SQL查询结果行数</div>
            </Flex>
          </Space>
        </Card>
      </Flex>
    </Form>
  );
};
