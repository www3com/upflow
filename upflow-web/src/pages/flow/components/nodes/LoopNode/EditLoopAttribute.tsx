import React, {useEffect, useMemo, useState} from "react";
import {Card, Flex, Form, Input, Select} from "antd";
import VariableSelect from "@/components/VariableSelect";
import {getAvailableVariablesWithNode} from "@/utils/variables";
import {Node} from "@xyflow/react";
import {useSnapshot} from "valtio";
import {state} from "@/states/flow";
import {LoopNodeType} from "@/typings";

interface LoopNodeProps {
    node: Node,
    onChange: (node: Node) => void
}

export default ({node, onChange}: LoopNodeProps) => {
    const flowState = useSnapshot(state);
    const [form] = Form.useForm();
    const [loopType, setLoopType] = useState<string>('');

    // 初始化表单数据
    useEffect(() => {
        const nodeData = node.data as any; // 使用 any 来避免类型冲突
        const initialValues = {
            type: nodeData.type || '',
            forNodeId: nodeData.forNodeId || '',
            forVarName: nodeData.forVarName || '',
            whileNumber: nodeData.whileNumber || 1,
            bodyVarName: nodeData.bodyVarName || 'item',
            bodyIndexName: nodeData.bodyIndexName || 'index'
        };
        
        form.setFieldsValue(initialValues);
        setLoopType(nodeData.type || '');
    }, [node.data, form]);

    // 表单提交处理
    const onFinish = (values: any) => {
        console.log('Form values:', values);
        
        // 构建更新后的节点数据
        const updatedData: any = {
            ...node.data,
            type: values.type,
            bodyVarName: values.bodyVarName,
            bodyIndexName: values.bodyIndexName
        };

        // 根据循环类型添加特定字段
        if (values.type === 'for') {
            updatedData.forNodeId = values.forNodeId;
            updatedData.forVarName = values.forVarName;
            // 清除 while 相关字段
            delete updatedData.whileNumber;
        } else if (values.type === 'while') {
            updatedData.whileNumber = values.whileNumber;
            // 清除 for 相关字段
            delete updatedData.forNodeId;
            delete updatedData.forVarName;
        } else if (values.type === 'forever') {
            // 清除 for 和 while 相关字段
            delete updatedData.forNodeId;
            delete updatedData.forVarName;
            delete updatedData.whileNumber;
        }

        // 创建更新后的节点
        const updatedNode: Node = {
            ...node,
            data: updatedData
        };

        // 调用 onChange 回调更新节点
        onChange(updatedNode);
    };

    // 表单值变化时自动保存
    const onValuesChange = (changedValues: any, allValues: any) => {
        // 实时更新节点数据
        onFinish(allValues);
    };

    // 获取可用变量列表
    const variablesWithNode = useMemo(() => {
        return getAvailableVariablesWithNode(node.id, flowState.nodes as Node[], flowState.edges as any[]);
    }, [node.id, flowState.nodes, flowState.edges]);

    const options = [
        {value: 'for', label: '使用数组循环'},
        {value: 'while', label: '指定循环次数'},
        {value: 'forever', label: '无限循环'}];

    const handleLoopTypeChange = (value: string) => {
        setLoopType(value);
        // 当循环类型改变时，触发表单更新
        form.setFieldValue('type', value);
    };

    return <>
        <Form 
            form={form} 
            onFinish={onFinish} 
            onValuesChange={onValuesChange}
            layout="vertical"
        >
            <Flex align='center' justify={'center'} vertical>
                {/* 循环配置 */}
                <Card title='循环变量' style={{width: "100%", boxShadow: 'none'}} size="small" variant='borderless'>
                    <Form.Item
                        name="type"
                        label="循环类型"
                        rules={[{required: true, message: '请选择循环类型'}]}
                    >
                        <Select 
                            placeholder="请选择循环类型" 
                            options={options}
                            onChange={handleLoopTypeChange}
                        />
                    </Form.Item>
                    
                    {/* 根据循环类型显示不同内容 */}
                    {loopType === 'for' && (
                        <Form.Item
                            name="loopCondition"
                            label="循环变量"
                            rules={[{required: true, message: '请输入循环条件'}]}
                        >
                            <VariableSelect
                                variablesWithNode={variablesWithNode}
                                showVariableLabel={true}/>
                        </Form.Item>
                    )}
                    
                    {loopType === 'while' && (
                        <Form.Item
                            name="whileNumber"
                            label="循环次数"
                            rules={[{required: true, message: '请输入循环次数'}]}
                        >
                            <Input placeholder="请输入循环次数" type="number" />
                        </Form.Item>
                    )}
                    
                    {/* forever 类型不显示任何额外内容 */}
                </Card>

                {/* 循环体变量配置 */}
                <Card title='循环体变量' style={{width: "100%", boxShadow: 'none'}} size="small" variant='borderless'>
                    <Form.Item
                        name="bodyVarName"
                        label="循环体变量名"
                        rules={[{required: true, message: '请输入循环体变量名'}]}
                    >
                        <Input placeholder="请输入循环体变量名"/>
                    </Form.Item>
                    <Form.Item
                        name="bodyIndexName"
                        label="序号变量名"
                        rules={[{required: true, message: '请输入序号变量名'}]}
                    >
                        <Input placeholder="请输入序号变量名"/>
                    </Form.Item>
                </Card>
            </Flex>
        </Form>
    </>
}