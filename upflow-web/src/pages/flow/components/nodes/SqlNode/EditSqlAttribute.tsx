import React, {useEffect, useMemo, useState} from "react";
import {Button, Card, Flex, Form, Input, List, Select, Space, theme, Divider, Splitter} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import VariableSelect from "@/components/VariableSelect";
import {getAvailableVariablesWithNode} from "@/utils/variables";
import {Node} from "@xyflow/react";
import {useSnapshot} from "valtio";
import {state} from "@/states/flow";
import {VariableSelectValue} from "@/components/VariableSelect";
import MonacoEditor from "@/components/MonacoEditor";
import {
    ScriptNodeType,
    ScriptInputVariable,
    ScriptOutputVariable,
    VariableType,
    ScriptLanguage
} from "@/typings";


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
interface OutputVariableForm extends Omit<ScriptOutputVariable, 'type'> {
    type: VariableType;
}

// 脚本节点数据接口 - 基于 ScriptNodeType
interface ScriptNodeData extends Omit<ScriptNodeType, 'inputVariables' | 'outputVariables' | 'language' | 'script'> {
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

    // 生成输出变量的函数
    const generateOutputVariables = (rowsType: VariableType = 'list'): OutputVariableForm[] => [
        { name: 'rows', type: rowsType },
        { name: 'rowNum', type: 'int' }
    ];

    // 初始化表单数据
    useEffect(() => {
        const nodeData = (node.data as unknown) as ScriptNodeData;
        
        // 获取现有的 rows 类型，如果不存在则默认为 'list'
        const existingRowsType = nodeData.outputVariables?.[0]?.type || 'list';
        const outputVariables = generateOutputVariables(existingRowsType);
        
        const initialValues = {
            inputVariables: nodeData.inputVariables || [],
            language: nodeData.language || 'sql',
            script: nodeData.script || '',
            outputVariables: outputVariables
        };

        form.setFieldsValue(initialValues);
        
        // 确保节点数据中也包含正确的输出变量结构
        if (!nodeData.outputVariables || 
            nodeData.outputVariables.length !== 2 ||
            nodeData.outputVariables[0]?.name !== 'rows' ||
            nodeData.outputVariables[1]?.name !== 'rowNum') {
            
            const updatedData = {
                ...nodeData,
                outputVariables: outputVariables,
                language: nodeData.language || 'sql'
            } as ScriptNodeData;

            const updatedNode = {
                ...node,
                data: (updatedData as unknown) as Record<string, unknown>
            };

            onChange(updatedNode);
        }
    }, [node.data, form]);

    // 表单值变化处理
    const onValuesChange = (changedValues: any, allValues: any) => {
        // 获取当前的 rows 类型
        const rowsType = allValues.outputVariables?.[0]?.type || 'list';
        const outputVariables = generateOutputVariables(rowsType);
        
        const updatedData = {
            ...node.data,
            ...allValues,
            // 使用生成的输出变量，保持 rows 类型可选择，rowNum 固定为 int
            outputVariables: outputVariables
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
                    <Form.Item
                        name="script"
                        style={{marginBottom: 0}}
                    >
                        <MonacoEditor
                            language='sql'
                            placeholder="请输入sql..."
                            height={400}
                        />
                    </Form.Item>
                </div>

                {/* 输出变量 - rows 可选择类型，rowNum 固定 */}
                <Card
                    title='输出变量'
                    style={{width: "100%", boxShadow: 'none'}}
                    size="small"
                    variant='borderless'
                >
                    <Space direction="vertical" style={{width: "100%"}} size="small">
                        {/* rows 变量 - 类型可选择 */}
                        <Flex style={{width: "100%"}} gap={8} align="center">
                            <div style={{flex: 2, fontWeight: 500}}>
                                rows
                            </div>
                            <div style={{flex: 1}}>
                                <Form.Item
                                    name={['outputVariables', 0, 'type']}
                                    style={{marginBottom: 0}}
                                >
                                    <Select
                                        size="small"
                                        options={VARIABLE_TYPES}
                                        placeholder="选择类型"
                                    />
                                </Form.Item>
                            </div>
                            <div style={{flex: 2, color: token.colorTextTertiary, fontSize: '12px'}}>
                                SQL查询结果行数据
                            </div>
                        </Flex>
                        
                        {/* rowNum 变量 - 固定为 int 类型 */}
                        <Flex style={{width: "100%"}} gap={8} align="center">
                            <div style={{flex: 2, fontWeight: 500}}>
                                rowNum
                            </div>
                            <div style={{flex: 1, color: token.colorTextSecondary}}>
                                整形
                            </div>
                            <div style={{flex: 2, color: token.colorTextTertiary, fontSize: '12px'}}>
                                SQL查询结果行数
                            </div>
                        </Flex>
                    </Space>
                </Card>
            </Flex>
        </Form>
    );
}