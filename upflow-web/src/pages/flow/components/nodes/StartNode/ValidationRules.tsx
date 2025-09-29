import React from 'react';
import { Button, Flex, Form, Input, List, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { VALIDATION_RULE_TYPES, VARIABLE_TYPE_RULES_MAP, VALIDATION_RULE_DEFAULT_MESSAGES } from '@/utils/constants';

// 根据变量类型获取可用的校验规则
const getAvailableRules = (variableType: string) => {
  const availableRuleTypes = VARIABLE_TYPE_RULES_MAP[variableType as keyof typeof VARIABLE_TYPE_RULES_MAP] || [];
  return VALIDATION_RULE_TYPES.filter((rule: any) => availableRuleTypes.includes(rule.value));
};

// 获取校验规则的默认错误提示
const getDefaultErrorMessage = (ruleType: string, value?: string): string => {
    const template = VALIDATION_RULE_DEFAULT_MESSAGES[ruleType];
    if (!template) return "";
    
    // 对于需要参数的规则类型，如果没有提供值则返回基础模板
    if (!value) return template;
    
    // 处理不同类型的参数替换
    switch (ruleType) {
        case 'max':
        case 'min':
            return template.replace('{value}', value);
        case 'length':
        case 'size':
            // 处理范围值格式 "min,max"
            if (value.includes(',')) {
                const [min, max] = value.split(',');
                return template.replace('{min}', min || '0').replace('{max}', max || '∞');
            }
            return template;
        case 'enum':
            // 处理枚举值，假设用逗号分隔
            return template.replace('{options}', value);
        default:
            return template;
    }
};

// LengthOrSize 组件
export const LengthOrSize = ({ value, onChange, style }: {
    value?: string,
    onChange?: (value: string) => void,
    style?: React.CSSProperties
}) => {
    const [minValue, maxValue] = value ? value.split(',') : ['', ''];
    
    const handleChange = (min: string, max: string) => {
        onChange?.(`${min},${max}`);
    };

    return (
        <Input.Group compact style={style}>
            <Input
                style={{ width: '50%' }}
                placeholder="最小值"
                value={minValue}
                onChange={(e) => handleChange(e.target.value, maxValue)}
            />
            <Input
                style={{ width: '50%' }}
                placeholder="最大值"
                value={maxValue}
                onChange={(e) => handleChange(minValue, e.target.value)}
            />
        </Input.Group>
    );
};

// 规则值输入组件
const RuleValueInput: React.FC<{ 
    name: number; 
    restField: any; 
    ruleType: string; 
    onValueChange: (value: string, name: number) => void;
}> = ({ name, restField, ruleType, onValueChange }) => {
    if (ruleType === 'required') {
        return null; // required 规则不需要值
    }

    return (
        <Form.Item {...restField} name={[name, 'value']} noStyle>
            <Input 
                placeholder="请输入值" 
                className="input-width" 
                onChange={(e) => onValueChange(e.target.value, name)}
            />
        </Form.Item>
    );
};

// 渲染校验输入组件
const renderValidationInput = (currentType: string, restField: any, name: number, onValueChange: (value: string, name: number) => void) => {
    if (currentType === 'length' || currentType === 'size') {
        return (
            <Form.Item {...restField} name={[name, 'value']} noStyle>
                <LengthOrSize 
                    style={{ width: '150px' }} 
                    onChange={(value) => onValueChange(value, name)}
                />
            </Form.Item>
        );
    }
    
    if (currentType === 'required' || currentType === 'email') {
        return null;
    }
    
    return (
        <RuleValueInput 
            name={name}
            restField={restField}
            ruleType={currentType}
            onValueChange={onValueChange}
        />
    );
};

// 单个校验规则项组件
interface ValidationRuleItemProps {
    field: any;
    onRemove: (name: number) => void;
    onRuleTypeChange: (value: string, name: number) => void;
    onRuleValueChange: (value: string, name: number) => void;
    form: any;
    token: any;
    variableType?: string;
}

export const ValidationRuleItem: React.FC<ValidationRuleItemProps> = ({
    field,
    onRemove,
    onRuleTypeChange,
    onRuleValueChange,
    form,
    token,
    variableType = 'string'
}) => {
    const { key, name, ...restField } = field;
    const availableRules = getAvailableRules(variableType);

    return (
        <List.Item key={key} className="validation-list-item">
            <Flex gap={8} align="center" className="full-width">
                <Form.Item {...restField} name={[name, 'type']} noStyle>
                    <Select
                        className="select-width"
                        onChange={(value) => onRuleTypeChange(value, name)}
                    >
                        {availableRules.map(rule => (
                            <Select.Option key={rule.value} value={rule.value}>
                                {rule.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => {
                        const prevType = prevValues?.rules?.[name]?.type;
                        const currentType = currentValues?.rules?.[name]?.type;
                        return prevType !== currentType;
                    }}
                >
                    {() => {
                        const currentType = form.getFieldValue(['rules', name, 'type']);
                        return renderValidationInput(currentType, restField, name, onRuleValueChange);
                    }}
                </Form.Item>
                
                <Flex flex={1}>
                    <Form.Item {...restField} name={[name, 'message']} noStyle>
                        <Input placeholder="请输入错误提示" className="full-width" />
                    </Form.Item>
                </Flex>

                <Button
                    type="text"
                    icon={<MinusCircleOutlined style={{ color: token.colorPrimary }} />}
                    size="small"
                    onClick={() => onRemove(name)}
                />
            </Flex>
        </List.Item>
    );
};

// 校验规则列表组件
interface ValidationRulesListProps {
    form: any;
    token: any;
    variableType?: string;
}

export const ValidationRulesList: React.FC<ValidationRulesListProps> = ({ form, token, variableType = 'string' }) => {
    const handleRuleTypeChange = (value: string, name: number) => {
        form.setFieldValue(['rules', name, 'value'], '');
        // 自动设置默认错误提示
        const defaultMessage = getDefaultErrorMessage(value);
        form.setFieldValue(['rules', name, 'message'], defaultMessage);
    };

    // 当规则值改变时，动态更新错误提示
    const handleRuleValueChange = (value: string, name: number) => {
        const ruleType = form.getFieldValue(['rules', name, 'type']);
        if (ruleType) {
            const updatedMessage = getDefaultErrorMessage(ruleType, value);
            form.setFieldValue(['rules', name, 'message'], updatedMessage);
        }
    };

    // 获取当前变量类型的默认校验规则
    const getDefaultRuleType = () => {
        const availableRules = getAvailableRules(variableType);
        return availableRules.length > 0 ? availableRules[0].value : 'required';
    };

    return (
        <Form.Item label="校验规则">
            <Form.List name="rules">
                {(fields, { add, remove }) => (
                    <>
                        {fields.length === 0 && (
                            <div className="empty-state">
                                暂无校验规则
                            </div>
                        )}
                        
                        {fields.map((field) => (
                            <ValidationRuleItem
                                key={field.key}
                                field={field}
                                onRemove={remove}
                                onRuleTypeChange={handleRuleTypeChange}
                                onRuleValueChange={handleRuleValueChange}
                                form={form}
                                token={token}
                                variableType={variableType}
                            />
                        ))}
                        
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            className="full-width"
                            size="small"
                            onClick={() => {
                                const defaultRuleType = getDefaultRuleType();
                                const defaultMessage = getDefaultErrorMessage(defaultRuleType);
                                add({ type: defaultRuleType, message: defaultMessage });
                            }}
                        >
                            添加校验规则
                        </Button>
                    </>
                )}
            </Form.List>
        </Form.Item>
    );
};