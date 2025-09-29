import React from 'react';
import {Form, Input, Modal, Select, theme} from "antd";
import IconFont from '@/components/IconFont';
import './styles.less';
import {Variable} from "@/typings";
import {ValidationRulesList} from './ValidationRules';
import {VARIABLE_TYPE_RULES_MAP} from '@/utils/constants';

// 常量定义
const VARIABLE_TYPES = [
    {value: "string", label: "字符串"},
    {value: "int", label: "整形"},
    {value: "long", label: "长整型"},
    {value: "list", label: "列表"}
];

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
    const [currentVariableType, setCurrentVariableType] = React.useState<string>('string');

    // 确保表单在打开时重置并设置初始值
    React.useEffect(() => {
        if (open) {
            form.resetFields();
            form.setFieldsValue(variable);
            setCurrentVariableType(variable.type || 'string');
        }
    }, [open, variable, form]);

    // 监听变量类型变化，清理不兼容的校验规则
    const handleVariableTypeChange = (newType: string) => {
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

    const handleOk = () => {
        form.validateFields().then((values) => {
            console.log('form values:', values);
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
                    <Select onChange={handleVariableTypeChange}>
                        {VARIABLE_TYPES.map(type => (
                            <Select.Option key={type.value} value={type.value}>
                                {type.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <ValidationRulesList form={form} token={token} variableType={currentVariableType}/>
            </Form>
        </Modal>
    );
};