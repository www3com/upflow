import React from 'react';
import {Button, Form, Input, List, Modal, Select, Space, theme} from "antd";
import {
    createFromIconfontCN,
    MinusCircleOutlined,
    PlusOutlined
} from "@ant-design/icons";
import './styles.less';
import {Rule, Variable} from "@/states/startNode";

const IconFont = createFromIconfontCN({
    scriptUrl: '/public/iconfont.js',
});

const {useToken} = theme;

interface EditStartDialogProps {
    open: boolean,
    variable?: Variable
    onUpdate?: (variable: Variable) => void
    onCancel?: () => void
}

export default ({open, variable = {} as Variable, onUpdate, onCancel}: EditStartDialogProps) => {
    const [form] = Form.useForm();
    const {token} = useToken();

    // 确保表单在打开时重置并设置初始值
    React.useEffect(() => {
        if (open) {
            form.resetFields();
            form.setFieldsValue(variable);
        }
    }, [open, variable, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            console.log('form values:', values);
            onUpdate?.(values);
        });
    };

    // 使用 Form.List 的 add 方法添加规则，不再需要单独的 addRule 方法


    return (<>
            <Modal width={700}
                   title={<><IconFont type="icon-variable" style={{fontSize: 18}}/> 编辑变量</>}
                   open={open}
                   onOk={handleOk}
                   onCancel={() => onCancel?.()}
            >
                <Form form={form} layout="vertical" initialValues={variable}>
                    <Form.Item label="变量名称" name='name'>
                        <Input placeholder="请输入变量名称"/>
                    </Form.Item>
                    <Form.Item label="变量类型" name='type'>
                        <Select>
                            <Select.Option value="string">字符串</Select.Option>
                            <Select.Option value="int">整形</Select.Option>
                            <Select.Option value="long">长整型</Select.Option>
                            <Select.Option value="list">列表</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="校验规则">
                        <Form.List name="rules">
                            {(fields, {add, remove}) => (
                                <>
                                    {fields.length === 0 && (
                                        <div style={{textAlign: 'center', padding: '10px 0', color: '#999'}}>
                                            暂无校验规则
                                        </div>
                                    )}
                                    {fields.map(({key, name, ...restField}) => {
                                        return (
                                            <List.Item key={key} style={{
                                                borderBottom: '1px solid #f0f0f0',
                                                paddingBottom: '10px',
                                                marginBottom: '10px'
                                            }}>
                                                <Space size={3} style={{width: '100%'}}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'type']}
                                                        noStyle
                                                    >
                                                        <Select
                                                            style={{width: '120px'}}
                                                            onChange={(value) => {
                                                                // 如果是 length 或 size 类型，设置默认值为 ','
                                                                if (value === 'length' || value === 'size') {
                                                                    form.setFieldValue(['rules', name, 'value'], ',');
                                                                }
                                                            }}
                                                        >
                                                            <Select.Option value="required">必填</Select.Option>
                                                            <Select.Option value="max">最大值</Select.Option>
                                                            <Select.Option value="min">最小值</Select.Option>
                                                            <Select.Option value="length">长度</Select.Option>
                                                            <Select.Option value="enum">枚举</Select.Option>
                                                            <Select.Option value="size">集合大小</Select.Option>
                                                            <Select.Option value="email">邮箱格式</Select.Option>
                                                            <Select.Option value="pattern">正则表达式</Select.Option>
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
                                                            if (currentType === 'length' || currentType === 'size') {
                                                                return (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'value']}
                                                                        noStyle
                                                                    >
                                                                        <LengthOrSize style={{width: '150px'}}/>
                                                                    </Form.Item>
                                                                );
                                                            }

                                                            if (currentType === 'max' || currentType === 'min' || currentType === 'enum' || currentType === 'email' || currentType === 'pattern') {
                                                                return (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'value']}
                                                                        noStyle
                                                                    >
                                                                        <Input placeholder="请输入校验值" style={{width: '150px'}}/>
                                                                    </Form.Item>
                                                                );
                                                            }

                                                            return null;
                                                        }}
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'message']}
                                                        noStyle
                                                        style={{flex: 1}}
                                                    >
                                                        <Input placeholder="请输入错误提示" />
                                                    </Form.Item>

                                                    <Button
                                                        type="text"
                                                        icon={<MinusCircleOutlined
                                                            style={{color: token.colorPrimary}}/>}
                                                        size="small"
                                                        onClick={() => remove(name)}
                                                    />
                                                </Space>
                                            </List.Item>
                                        );
                                    })}
                                    <Button
                                        type="dashed"
                                        icon={<PlusOutlined/>}
                                        style={{width: "100%"}}
                                        size="small"
                                        onClick={() => add({type: 'required', message: ''})}
                                    />
                                </>
                            )}
                        </Form.List>
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
};

export const LengthOrSize = ({value, onChange, style}: {
    value?: string,
    onChange?: (value: string) => void,
    style?: React.CSSProperties
}) => {
    // 解析传入的值，格式为 "min,max"
    const [min, max] = value ? value.split(',') : ['', ''];

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = e.target.value;
        onChange?.(`${newMin},${max}`);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = e.target.value;
        onChange?.(`${min},${newMax}`);
    };

    return (
        <Space.Compact style={style}>
            <Input placeholder="最小值" value={min} onChange={handleMinChange}/>
            <Input placeholder="最大值" value={max} onChange={handleMaxChange}/>
        </Space.Compact>
    )
}