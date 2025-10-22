import MonacoEditor from '@/components/MonacoEditor';
import VariableAvailableSelect from '@/components/VariableAvailableSelect';
import { getAvailableVariables } from '@/pages/flow/variables';
import { state } from '@/states/flow';
import { EdgeType, NodeType, SqlNodeType } from '@/types/flow';
import { VARIABLE_TYPES } from '@/utils/constants';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input, List, theme } from 'antd';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import VariableTypeSelect from '@/components/VariableTypeSelect';

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
    const initialValues = {
      input: node.data.input || [],
      content: node.data.content || '',
      output: [
        { type: node.data.output?.[0]?.type || 'ARRAY_OBJECT' }, // rows 变量
        { type: 'INTEGER' }, // rowNum 变量，固定为整形
      ],
    };
    form.setFieldsValue(initialValues);
  }, [node.data, form]);

  // 表单值变化处理
  const onValuesChange = (changedValues: any, allValues: any) => {
    const updatedData: SqlNodeType = {
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
    };

    const updatedNode = {
      ...node,
      data: updatedData,
    };

    onChange(updatedNode);
  };

  // 获取可用变量列表
  const availableVariables = useMemo(() => {
    return getAvailableVariables(node.id, flowState.nodes as NodeType<SqlNodeType>[], flowState.edges as EdgeType<any>[]);
  }, [node.id, flowState.nodes, flowState.edges]);

  return (
    <Form form={form} onValuesChange={onValuesChange}>
      <Flex align="center" justify={'center'} vertical>
        {/* 输入变量 */}
        <Form.List name="input">
          {(fields, { add, remove }) => (
            <Card
              title="输入变量"
              style={{ width: '100%', boxShadow: 'none' }}
              size="small"
              variant="borderless"
              extra={
                <Button type="text" icon={<PlusOutlined />} size="small" onClick={() => add({ name: '', value: undefined })} />
              }
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
                          <VariableAvailableSelect variablesWithNode={availableVariables} placeholder="选择变量值" />
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
                <div style={{ padding: '16px 0', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                  暂无输入变量，点击右上角按钮添加
                </div>
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
          <Form.Item
            label="rows"
            labelCol={{ span: 6 }}
            tooltip="SQL查询结果行数据"
            layout="horizontal"
            name={['output', 0, 'type']}
          >
            <VariableTypeSelect options={VARIABLE_TYPES} basic={true} placeholder={'请选择变量类型'} />
          </Form.Item>
          <Form.Item
            label="rowNum"
            labelCol={{ span: 6 }}
            tooltip="SQL查询结果行数"
            layout="horizontal"
            name={['output', 1, 'rowNum']}
          >
            Integer
          </Form.Item>
        </Card>
      </Flex>
    </Form>
  );
};
