import React from 'react';
import {Cascader, Form, Input, Modal, theme} from "antd";
import IconFont from '@/components/IconFont';
import './styles.less';
import {Variable} from "@/typings";
import {ValidationRulesList} from './ValidationRules';
import {VARIABLE_TYPE_TREE, VARIABLE_TYPE_RULES_MAP} from '@/utils/constants';

interface EditStartDialogProps {
    open: boolean,
    variable?: Variable
    onUpdate?: (variable: Variable) => void
    onCancel?: () => void
}

// 渲染校验值输入组件
export default ({open, variable = {} as Variable, onUpdate, onCancel}: EditStartDialogProps) => {
    const [form] = Form.useForm();
    const {token} = theme.useToken();
    const [currentVariableType, setCurrentVariableType] = React.useState<string>('STRING');

    // 确保表单在打开时重置并设置初始值
    React.useEffect(() => {
        if (open) {
            form.resetFields();
            form.setFieldsValue(variable);
            setCurrentVariableType(variable.type || 'STRING');
        }
    }, [open, variable, form]);

    // 监听变量类型变化，清理不兼容的校验规则
    const handleVariableTypeChange = (value: string[], selectedOptions: any[]) => {
        // Cascader 返回的是路径数组，我们需要最后一个值作为实际的类型
        const newType = value[value.length - 1];
        console.log('variable type change:', newType)
        setCurrentVariableType(newType);

        const supportedRules = VARIABLE_TYPE_RULES_MAP[newType as keyof typeof VARIABLE_TYPE_RULES_MAP] || [];
        const currentRules = form.getFieldValue('rules') || [];

        // 过滤掉不支持的校验规则
        const filteredRules = currentRules.filter((rule: any) =>
            supportedRules.includes(rule?.type)
        );

        // 更新表单中的校验规则
        form.setFieldValue('rules', filteredRules);
    };

    // 自定义 Cascader 显示渲染函数
    const displayRender = (labels: string[], selectedOptions?: any[]) => {
        if (!labels || labels.length === 0) return '';
        
        // 递归构建嵌套格式，统一处理所有层级
        const buildNestedLabel = (labelArray: string[]): string => {
            if (labelArray.length === 1) {
                return labelArray[0];
            }
            const [first, ...rest] = labelArray;
            return `${first}<${buildNestedLabel(rest)}>`;
        };
        
        return buildNestedLabel(labels);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            console.log('form values:', values);
            delete values.type;
            values.type = currentVariableType;
            onUpdate?.(values);
        });
    };

    return (
        <Modal
            width={700}
            title={<><IconFont type="icon-variable" style={{fontSize: 18}}/> 编辑变量</>}
            open={open}
            onOk={handleOk}
            onCancel={() => onCancel?.()}
            okText="确定"
            cancelText="取消"
            className="edit-start-dialog"
        >
            <Form form={form} layout="vertical" initialValues={variable}>
                <Form.Item label="变量名称" name='name'>
                    <Input placeholder="请输入变量名称"/>
                </Form.Item>

                <Form.Item label="变量类型" name='type'>
                    <Cascader 
                        options={VARIABLE_TYPE_TREE} 
                        onChange={handleVariableTypeChange} 
                        placeholder="请选择变量类型"
                        displayRender={displayRender}
                    />
                </Form.Item>

                <ValidationRulesList form={form} token={token} variableType={currentVariableType}/>
            </Form>
        </Modal>
    );
};