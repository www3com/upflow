import MonacoEditor from '@/components/MonacoEditor';
import VariableAvailableSelect from '@/components/VariableAvailableSelect';
import { getAvailableVariables } from '@/pages/flow/variables';
import { state } from '@/states/flow';
import { CodeNodeType, EdgeType, NodeType, SqlNodeType } from '@/types/flow';
import { VARIABLE_TYPES } from '@/utils/constants';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Flex, Form, Input, List, Select, theme } from 'antd';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import VariableTypeSelect from '@/components/VariableTypeSelect';

const { useToken } = theme;

interface ScriptNodeProps {
  node: NodeType<CodeNodeType>;
  onChange: (node: NodeType<CodeNodeType>) => void;
}

export default ({ node, onChange }: ScriptNodeProps) => {
  const flowState = useSnapshot(state);
  const { token } = useToken();
  const [form] = Form.useForm();

  // 监听 language 字段的变化
  const language = Form.useWatch('language', form) || 'javascript';

  // 初始化表单数据
  useEffect(() => {
    const initialValues = {
      inputVariables: node.data.input || [],
      language: node.data.language || 'javascript',
      script: node.data.content || '',
      outputVariables: node.data.output || [],
    };

    form.setFieldsValue(initialValues);
  }, [node.data, form]);

  // 表单值变化处理
  const onValuesChange = (changedValues: any, allValues: any) => {
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        ...allValues,
      },
    };

    onChange(updatedNode);
  };

  // 获取可用变量列表
  const variablesWithNode = useMemo(() => {
    return getAvailableVariables(node.id, flowState.nodes as NodeType<SqlNodeType>[], flowState.edges as EdgeType<any>[]);
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
                    <List.Item key={field.name} style={{ padding: '2px 0' }}>
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
          {/* 语言选择 */}
          <Flex align="center" style={{ marginBottom: 8 }}>
            <Form.Item name="language" style={{ marginBottom: 0, marginRight: 8 }}>
              <Select
                variant="borderless"
                size={'small'}
                style={{ width: 'auto' }}
                placeholder="请选择语言"
                options={[
                  { value: 'javascript', label: 'JavaScript' },
                  { value: 'python', label: 'Python' },
                ]}
              />
            </Form.Item>
          </Flex>
          <Divider style={{ margin: '0 0 8px 0' }} />

          {/* 代码编辑器 */}
          <Form.Item name="script" style={{ marginBottom: 0 }}>
            <MonacoEditor language={language} placeholder="请输入脚本代码..." height={400} />
          </Form.Item>
        </div>

        {/* 输出变量 */}
        <Form.List name="output">
          {(fields, { add, remove }) => (
            <Card
              title="输出变量"
              style={{ width: '100%', boxShadow: 'none' }}
              size="small"
              variant="borderless"
              extra={
                <Button type="text" icon={<PlusOutlined />} size="small" onClick={() => add({ name: '', type: 'string' })} />
              }
            >
              {fields.length > 0 ? (
                <List
                  size="small"
                  bordered={false}
                  split={false}
                  dataSource={fields}
                  renderItem={(field) => (
                    <List.Item key={field.key} style={{ padding: '4px 0' }}>
                      <Flex style={{ width: '100%' }} gap={8} align="center">
                        <Form.Item {...field} name={[field.name, 'name']} style={{ marginBottom: 0, flex: 3 }}>
                          <Input placeholder="变量名" />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'type']} style={{ marginBottom: 0, flex: 2 }}>
                          <VariableTypeSelect options={VARIABLE_TYPES} placeholder="请选择变量类型" />
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
                  暂无输出变量，点击右上角按钮添加
                </div>
              )}
            </Card>
          )}
        </Form.List>
      </Flex>
    </Form>
  );
};
