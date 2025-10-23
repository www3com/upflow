import VariableAvailableSelect from '@/components/VariableAvailableSelect';
import { getAvailableVariables } from '@/pages/flow/variables';
import { state } from '@/states/flow';
import { CodeNodeType, EdgeType, NodeType, SqlNodeType } from '@/types/flow';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input, List, theme } from 'antd';
import { useEffect, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import styles from './styles.less';

const { useToken } = theme;

interface EndNodeProps {
  node: NodeType<CodeNodeType>;
  onChange: (node: NodeType<CodeNodeType>) => void;
}

export default ({ node, onChange }: EndNodeProps) => {
  const flowState = useSnapshot(state);
  const { token } = useToken();
  const [form] = Form.useForm();

  // 初始化表单数据
  useEffect(() => {
    const initialValues = {
      input: node.data.input || [],
      language: node.data.language || 'javascript',
      content: node.data.content || '',
      output: node.data.output || [],
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
      <Flex className={styles.codeContainer}>
        {/* 输入变量 */}
        <Form.List name="input">
          {(fields, { add, remove }) => (
            <Card
              title="输出变量"
              className={styles.codeCard}
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
                    <List.Item key={field.name} className={styles.codeVariableItem}>
                      <Flex className={styles.codeInputRow}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'name']}
                          className={`${styles.codeField} ${styles.codeFieldName}`}
                        >
                          <Input placeholder="变量名" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'value']}
                          className={`${styles.codeField} ${styles.codeFieldValue}`}
                        >
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
                <div className={styles.codeEmptyState}>暂无输出变量，点击右上角按钮添加</div>
              )}
            </Card>
          )}
        </Form.List>
      </Flex>
    </Form>
  );
};
