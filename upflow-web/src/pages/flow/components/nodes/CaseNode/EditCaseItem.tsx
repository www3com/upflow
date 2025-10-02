import {Button, Flex, Card, Select, Input, Space, Form, Divider, Tag} from "antd";
import {
    CloseCircleOutlined,
    DeleteOutlined,
    PlusOutlined,
    SearchOutlined
} from "@ant-design/icons";
import IconFont from '@/components/IconFont';
import {theme} from "antd";
import {useEffect, useState} from "react";
import {Case, Condition} from "@/typings";
import {CompareOprType} from "@/utils/constants";
import {nanoid} from "nanoid";

const {useToken} = theme;

// 操作符选项
const OPERATOR_OPTIONS = Object.entries(CompareOprType).map(([value, label]) => ({
    value,
    label
}));

interface EditCaseItemProps {
    caseItem: Case;
    index: number;
    variablesWithNode: { nodeId: string; nodeName: string; varName: string; varType: string; nodeIcon: string }[];
    onDeleteCase: (index: number) => void;
    onUpdateCase: (caseIndex: number, conditions: Condition[], logicalOperator?: string) => void;
    form?: any;
}

export default function EditCaseItem({
                                         caseItem,
                                         index,
                                         variablesWithNode,
                                         onDeleteCase,
                                         onUpdateCase,
                                         form
                                     }: EditCaseItemProps) {
    const {token} = useToken();
    const [localForm] = Form.useForm();
    const currentForm = form || localForm;
    
    // 添加逻辑操作符状态管理
    const [logicalOperator, setLogicalOperator] = useState<string>(caseItem.opr || 'and');

    // 初始化表单数据
    useEffect(() => {
        currentForm.setFieldsValue({
            conditions: caseItem.conditions || []
        });
        // 同步逻辑操作符状态
        setLogicalOperator(caseItem.opr || 'and');
    }, [caseItem.conditions, caseItem.opr, currentForm]);

    // 监听表单变化并更新父组件
    const handleFormChange = () => {
        const conditions = currentForm.getFieldValue('conditions') || [];
        onUpdateCase(index, conditions, logicalOperator);
    };

    // 逻辑操作符切换函数
    const handleLogicalOperatorToggle = () => {
        const newOperator = logicalOperator === 'and' ? 'or' : 'and';
        setLogicalOperator(newOperator);
        // 立即更新父组件
        const conditions = currentForm.getFieldValue('conditions') || [];
        onUpdateCase(index, conditions, newOperator);
    };

    // 添加条件的函数
    const handleAddCondition = () => {
        const conditions = currentForm.getFieldValue('conditions') || [];
        const newCondition = {
            nodeId: nanoid(),
            varName: '',
            opr: 'in',
            value: ''
        };
        currentForm.setFieldsValue({
            conditions: [...conditions, newCondition]
        });
        // 延迟执行以确保表单更新完成
        setTimeout(handleFormChange, 0);
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
                            name={[name, 'varName']}
                            style={{marginBottom: 0}}
                        >
                            <Select
                                labelInValue={true}
                                variant="borderless"
                                popupMatchSelectWidth={false}
                                onChange={handleFormChange}
                                size="small"
                                suffixIcon={null}
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: '6px'
                                }}
                                labelRender={(option) => {
                                    // 如果没有选择，显示请选择变量
                                    if (!option || !option.value) {
                                        return (
                                            <span style={{color: token.colorTextPlaceholder}}>
                                                请选择变量
                                            </span>
                                        );
                                    }

                                    // 查找变量所属的节点
                                    const variable = variablesWithNode.find(v => v.varName === option.value);
                                    const nodeName = variable?.nodeName || '';
                                    const nodeIcon = variable?.nodeIcon || 'icon-default';

                                    return (
                                        <Flex gap={5}>
                                            {variable && <Flex>
                                                <IconFont type={nodeIcon}/>
                                                <span style={{fontWeight: 500}}> {nodeName}</span>
                                            </Flex>}
                                            {variable && <span style={{color: token.colorText}}>/</span>}
                                            <Flex style={{color: token.colorPrimary, fontWeight: 500}} gap={3}>
                                                <IconFont type="icon-variable" style={{color: token.colorPrimary}}/>
                                                {option.value}
                                            </Flex>
                                            {!variable && <CloseCircleOutlined style={{color: 'red'}}/>}
                                        </Flex>
                                    );
                                }}
                            >
                                {// 按节点名称分组
                                    Object.entries(
                                        variablesWithNode.reduce((groups, variable) => {
                                            if (!groups[variable.nodeName]) {
                                                groups[variable.nodeName] = [];
                                            }
                                            groups[variable.nodeName].push(variable);
                                            return groups;
                                        }, {} as {
                                            [nodeName: string]: Array<{
                                                nodeId: string;
                                                nodeName: string;
                                                varName: string;
                                                varType: string;
                                                nodeIcon: string
                                            }>
                                        })
                                    ).map(([nodeName, variables]) => {
                                        const nodeIcon = variables[0]?.nodeIcon || 'icon-default';
                                        return (
                                            <Select.OptGroup
                                                key={nodeName}
                                                label={
                                                    <Space>
                                                        <IconFont type={nodeIcon} style={{color: token.colorPrimary}}/>
                                                        {nodeName}
                                                    </Space>
                                                }
                                            >
                                                {variables.map((variable) => (
                                                    <Select.Option key={variable.varName} value={variable.varName}>
                                                        <Space>
                                                            <IconFont type="icon-variable"
                                                                      style={{color: token.colorPrimary}}/>
                                                            {variable.varName}
                                                        </Space>
                                                    </Select.Option>
                                                ))}
                                            </Select.OptGroup>
                                        );
                                    })}
                            </Select>
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
                    <Flex gap={5}>
                        <span style={{fontWeight: 'bold'}}>
                        {index === 0 ? 'IF' : `ELIF ${index}`}
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