import React, {useEffect, useMemo} from "react";
import {Button, Card, Divider, Flex, Form, Input, List, Select, theme} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import VariableSelect, {VariableSelectValue} from "@/components/VariableSelect";
import {getAvailableVariablesWithNode} from "@/pages/flow/variables";
import {Node} from "@xyflow/react";
import {useSnapshot} from "valtio";
import {state} from "@/states/flow";
import MonacoEditor from "@/components/MonacoEditor";
import {CodeNodeType, OutputVariable, ScriptLanguage, VariableType} from "@/typings";


const {useToken} = theme;

// 变量类型选项 - 使用新的 VariableType
const VARIABLE_TYPES: Array<{ value: VariableType, label: string }> = [
    {value: "string", label: "字符串"},
    {value: "int", label: "整形"},
    {value: "long", label: "长整型"},
    {value: "list", label: "列表"},
    {value: "boolean", label: "布尔值"},
    {value: "object", label: "对象"}
];

// 输入变量接口 - 适配 VariableSelectValue
interface InputVariableForm {
    name: string;
    value: VariableSelectValue;
}

// 输出变量接口 - 扩展标准类型
interface OutputVariableForm extends Omit<OutputVariable, 'type'> {
    type: VariableType;
}

// 脚本节点数据接口 - 基于 ScriptNodeType
interface ScriptNodeData extends Omit<CodeNodeType, 'inputVariables' | 'outputVariables' | 'language' | 'script'> {
    inputVariables?: InputVariableForm[];
    outputVariables?: OutputVariableForm[];
    language?: ScriptLanguage;
    script?: string;
}

interface ScriptNodeProps {
    node: Node,
    onChange: (node: Node) => void
}

export default ({node, onChange}: ScriptNodeProps) => {
    const flowState = useSnapshot(state);
    const {token} = useToken();
    const [form] = Form.useForm();

    // 监听 language 字段的变化
    const language = Form.useWatch('language', form) || 'javascript';

    // 初始化表单数据
    useEffect(() => {
        const nodeData = (node.data as unknown) as ScriptNodeData;
        const initialValues = {
            inputVariables: nodeData.inputVariables || [],
            language: nodeData.language || 'javascript',
            script: nodeData.script || '',
            outputVariables: nodeData.outputVariables || []
        };

        form.setFieldsValue(initialValues);
    }, [node.data, form]);

    // 表单值变化处理
    const onValuesChange = (changedValues: any, allValues: any) => {
        const updatedData = {
            ...node.data,
            ...allValues
        } as ScriptNodeData;

        const updatedNode = {
            ...node,
            data: (updatedData as unknown) as Record<string, unknown>
        };

        onChange(updatedNode);
    };

    // 获取可用变量列表
    const variablesWithNode = useMemo(() => {
        return getAvailableVariablesWithNode(node.id, flowState.nodes as Node[], flowState.edges as any[]);
    }, [node.id, flowState.nodes, flowState.edges]);

    return (
        <Form
            form={form}
            onValuesChange={onValuesChange}
            layout="vertical"
        >
            <Flex align='center' justify={'center'} vertical>
                {/* 输入变量 */}
                <Form.List name="inputVariables">
                    {(fields, {add, remove}) => (
                        <Card
                            title='输入变量'
                            style={{width: "100%", boxShadow: 'none'}}
                            size="small"
                            variant='borderless'
                            extra={
                                <Button
                                    type="text"
                                    icon={<PlusOutlined/>}
                                    size="small"
                                    onClick={() => add({name: '', value: undefined})}
                                />
                            }
                        >
                            {fields.length > 0 ? (
                                <List
                                    size="small"
                                    bordered={false}
                                    split={false}
                                    dataSource={fields}
                                    renderItem={(field) => (
                                        <List.Item key={field.key} style={{padding: '2px 0'}}>
                                            <Flex style={{width: "100%"}} gap={8} align="center">
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'name']}
                                                    style={{marginBottom: 0, flex: 1}}
                                                >
                                                    <Input placeholder="变量名"/>
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'value']}
                                                    style={{marginBottom: 0, flex: 2}}
                                                >
                                                    <VariableSelect
                                                        variablesWithNode={variablesWithNode}
                                                        placeholder="选择变量值"
                                                        showVariableLabel={false}
                                                    />
                                                </Form.Item>
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined style={{color: token.colorPrimary}}/>}
                                                    size="small"
                                                    onClick={() => remove(field.name)}
                                                />
                                            </Flex>
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <div style={{padding: '16px 0', textAlign: 'center', color: '#999', fontSize: '12px'}}>
                                    暂无输入变量，点击右上角按钮添加
                                </div>
                            )}
                        </Card>
                    )}
                </Form.List>


                {/* 脚本编辑框 */}
                <div style={{
                    width: "100%", overflow: 'hidden',
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadius
                }}>
                    {/* 语言选择 */}
                    <Flex align="center" style={{marginBottom: 8}}>
                        <Form.Item
                            name="language"
                            style={{marginBottom: 0, marginRight: 8}}
                        >
                            <Select
                                variant='borderless'
                                size={'small'}
                                style={{width: 'auto'}}
                                placeholder="请选择语言"
                                options={[
                                    {value: 'javascript', label: 'JavaScript'},
                                    {value: 'python', label: 'Python'},
                                ]}
                            />
                        </Form.Item>
                    </Flex>
                    <Divider style={{margin: '0 0 8px 0'}}/>

                    {/* 代码编辑器 */}
                    <Form.Item
                        name="script"
                        style={{marginBottom: 0}}
                    >
                        <MonacoEditor
                            language={language}
                            placeholder="请输入脚本代码..."
                            height={400}
                        />
                    </Form.Item>
                </div>

                {/* 输出变量 */}
                <Form.List name="outputVariables">
                    {(fields, {add, remove}) => (
                        <Card
                            title='输出变量'
                            style={{width: "100%", boxShadow: 'none'}}
                            size="small"
                            variant='borderless'
                            extra={
                                <Button
                                    type="text"
                                    icon={<PlusOutlined/>}
                                    size="small"
                                    onClick={() => add({name: '', type: 'string'})}
                                />
                            }
                        >
                            {fields.length > 0 ? (
                                <List
                                    size="small"
                                    bordered={false}
                                    split={false}
                                    dataSource={fields}
                                    renderItem={(field) => (
                                        <List.Item key={field.key} style={{padding: '4px 0'}}>
                                            <Flex style={{width: "100%"}} gap={8} align="center">
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'name']}
                                                    style={{marginBottom: 0, flex: 2}}
                                                >
                                                    <Input placeholder="变量名"/>
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'type']}
                                                    style={{marginBottom: 0, flex: 1}}
                                                >
                                                    <Select
                                                        placeholder="变量类型"
                                                        options={VARIABLE_TYPES}
                                                    />
                                                </Form.Item>
                                                <Button
                                                    type="text"
                                                    icon={<DeleteOutlined style={{color: token.colorPrimary}}/>}
                                                    size="small"
                                                    onClick={() => remove(field.name)}
                                                />
                                            </Flex>
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <div style={{padding: '16px 0', textAlign: 'center', color: '#999', fontSize: '12px'}}>
                                    暂无输出变量，点击右上角按钮添加
                                </div>
                            )}
                        </Card>
                    )}
                </Form.List>
            </Flex>
        </Form>
    );
}