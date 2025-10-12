import {Button, Flex, Card, Select, Input, Form, Divider} from "antd";
import {
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import IconFont from '@/components/IconFont';
import VariableSelect from '@/components/VariableSelect';
import {theme} from "antd";
import {useEffect, useState} from "react";
import {Case, Condition} from "@/typings";
import {CompareOprType} from "@/utils/constants";

const {useToken} = theme;

// 操作符选项
const OPERATOR_OPTIONS = Object.entries(CompareOprType).map(([value, label]) => ({
    value,
    label
}));

interface EditCaseItemProps {
    caseItem: Case;
    index: number;
    totalCases: number;
    variablesWithNode: { nodeId: string; nodeName: string; varName: string; varType: string; nodeIcon: string }[];
    onDeleteCase: (index: number) => void;
    onUpdateCase: (caseIndex: number, conditions: Condition[], logicalOperator?: string) => void;
    form?: any;
}

export default function EditCaseItem({
                                         caseItem,
                                         index,
                                         totalCases,
                                         variablesWithNode,
                                         onDeleteCase,
                                         onUpdateCase,
                                         form
                                     }: EditCaseItemProps) {
    const {token} = useToken();
    const [logicalOperator, setLogicalOperator] = useState<string>(caseItem.opr || 'and');

    // 获取当前表单实例
    const currentForm = form || Form.useForm()[0];

    // 初始化表单数据
    useEffect(() => {
        if (caseItem.conditions) {
            // 将Condition转换为表单可用的结构
            const formConditions = caseItem.conditions.map(condition => ({
                variable: condition.nodeId && condition.varName ? {
                    nodeId: condition.nodeId,
                    varName: condition.varName
                } : undefined,
                opr: condition.opr,
                value: condition.value
            }));
            
            currentForm.setFieldsValue({
                conditions: formConditions
            });
        }
    }, [caseItem, currentForm]);

    // 将表单数据转换回Condition结构的辅助函数
    const convertFormDataToConditions = (formConditions: any[]): Condition[] => {
        return formConditions.map(formCondition => ({
            nodeId: formCondition.variable?.nodeId || '',
            varName: formCondition.variable?.varName || '',
            opr: formCondition.opr || 'in',
            value: formCondition.value || ''
        }));
    };

    // 监听表单变化并更新父组件
    const handleFormChange = () => {
        const formConditions = currentForm.getFieldValue('conditions') || [];
        const conditions = convertFormDataToConditions(formConditions);
        onUpdateCase(index, conditions, logicalOperator);
    };

    // 逻辑操作符切换函数
    const handleLogicalOperatorToggle = () => {
        const newOperator = logicalOperator === 'and' ? 'or' : 'and';
        setLogicalOperator(newOperator);
        // 立即更新父组件
        const formConditions = currentForm.getFieldValue('conditions') || [];
        const conditions = convertFormDataToConditions(formConditions);
        onUpdateCase(index, conditions, newOperator);
    };

    // 添加条件的函数
    const handleAddCondition = () => {
        const formConditions = currentForm.getFieldValue('conditions') || [];
        const newFormCondition = {
            variable: undefined,
            opr: 'in',
            value: ''
        };
        currentForm.setFieldsValue({
            conditions: [...formConditions, newFormCondition]
        });
        
        // 更新父组件
        const updatedFormConditions = [...formConditions, newFormCondition];
        const conditions = convertFormDataToConditions(updatedFormConditions);
        onUpdateCase(index, conditions, logicalOperator);
    };

    // 渲染单个条件项
    const renderConditionItem = (field: any, remove: (name: number) => void) => {
        const {key, name, ...restField} = field;

        return (
            <Flex key={key} align="center" gap={5}>
                <Flex vertical gap={1} style={{
                    padding: '5px',
                    backgroundColor: '#f2f4f7',
                    borderRadius: '6px',
                    flex: 1
                }}>
                    {/* 第一行：变量和操作符 */}
                    <Flex align="center" gap={0} justify={'space-between'}>
                        <Form.Item
                            {...restField}
                            name={[name, 'variable']}
                            style={{marginBottom: 0}}
                        >
                            <VariableSelect
                                variablesWithNode={variablesWithNode}
                                variant="borderless"
                                size="small"
                                suffixIcon={null}
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '6px'
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            {...restField}
                            name={[name, 'opr']}
                            style={{marginBottom: 0}}>
                            <Select
                                placeholder="操作符"
                                variant="borderless"
                                popupMatchSelectWidth={false}
                                onChange={handleFormChange}
                                size="small">
                                {OPERATOR_OPTIONS.map(option => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Flex>

                    {/* 分隔线 */}
                    <Divider style={{margin: '4px 0'}}/>

                    {/* 第二行：输入值 */}
                    <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        style={{marginBottom: 0}}
                    >
                        <Input
                            placeholder="输入值"
                            onChange={handleFormChange}
                            style={{
                                border: 'none',
                                backgroundColor: 'transparent',
                                width: '100%'
                            }}
                            size="small"
                        />
                    </Form.Item>
                </Flex>

                <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined/>}
                    onClick={() => {
                        remove(name);
                        // 延迟执行以确保表单更新完成
                        setTimeout(handleFormChange, 0);
                    }}
                />
            </Flex>
        );
    };

    return (
        <Card
            style={{width: "100%", boxShadow: 'none'}}
            size="small"
            variant={'borderless'}
            title={
                <Flex justify="space-between" align="center">
                    <Flex gap={5} align="center">
                        <span style={{fontWeight: 'bold'}}>
                        {totalCases === 1 ? 'IF' : `CASE ${index + 1}`}
                        </span>
                        <Button 
                            size={'small'} 
                            type="dashed" 
                            icon={<IconFont type={'icon-qiehuan'}/>} 
                            iconPosition={'end'}
                            onClick={handleLogicalOperatorToggle}
                        >
                            {logicalOperator.toUpperCase()}
                        </Button>
                    </Flex>
                    <Flex gap={5} align="center">
                        <Button
                            type="text"
                            size="small"
                            icon={<PlusOutlined/>}
                            onClick={handleAddCondition}
                        />
                        <Button
                            type="text"
                            icon={<DeleteOutlined/>}
                            size="small"
                            onClick={() => onDeleteCase(index)}
                        />
                    </Flex>
                </Flex>
            }
        >
            <Form form={currentForm} onValuesChange={handleFormChange}>
                <Form.List name="conditions">
                    {(fields, {remove}) => (
                        <Flex vertical gap={5}>
                            {fields.length === 0 ? (
                                <span style={{color: token.colorTextSecondary, fontStyle: 'italic'}}>
                                        暂无条件，点击上方按钮添加
                                    </span>
                            ) : (
                                fields.map((field) => renderConditionItem(field, remove))
                            )}
                        </Flex>
                    )}
                </Form.List>
            </Form>
        </Card>
    );
}