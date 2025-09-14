import {Button, Card, Flex, Form, Input, List, Modal, Select, Space, Switch, theme} from "antd";
import {
    CloseOutlined, createFromIconfontCN,
    DeleteOutlined,
    EditOutlined,
    EnvironmentOutlined,
    MinusCircleOutlined,
    PlusOutlined, SearchOutlined
} from "@ant-design/icons";
import {useState} from "react";
import './styles.less';

const IconFont = createFromIconfontCN({
    scriptUrl: '/public/iconfont.js',
});

const {useToken} = theme;

interface Rule {
    type: string,
    value: string | boolean,
    message: string
}

interface Variable {
    name: string,
    type: string,
    value: string
    rules: [] | Rule[]
}

interface StartNodeProps {
    data: {
        title: string,
        variables: [] | Variable[]
    }
}

export default ({data}: StartNodeProps) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState<Variable | null>(null);
    const [rules, setRules] = useState<Rule[]>([]);
    const {token} = useToken();

    const handleOk = () => {
        form.validateFields().then((values) => {
           console.log('form values:', values);
           if (item) {
               // 更新当前编辑的变量的规则
               const updatedItem = {...item, ...values, rules: values.rules || []};
               // 这里应该有更新 data.variables 中对应项的逻辑
               // 由于这是一个演示组件，我们只关注规则的添加功能
               console.log('updatedItem:', updatedItem);
           }
           setOpen(false);
        });
    };

    const handleCancel = () => {
        setRules([]);
        setOpen(false);
    }

    const addRule = () => {
        const currentRules = form.getFieldValue('rules') || [];
        const newRule: Rule = {
            type: 'required',
            value: '',
            message: ''
        };
        form.setFieldsValue({ rules: [...currentRules, newRule] });
        // 保持rules状态同步，用于渲染列表
        setRules([...rules, newRule]);
    };
    return (<>
            <List size={"small"}
                  bordered={false}
                  dataSource={data.variables}
                  footer={
                      <Button type="dashed" icon={<PlusOutlined/>} style={{width: "100%"}}
                              size="small"/>
                  }
                  renderItem={(item: Variable) => (
                      <List.Item>
                          <Flex justify={"space-between"} style={{width: "100%"}} className="type-container">
                              <Space size={3}><IconFont type="icon-variable"/>{item.name}
                                  {item.rules && item.rules.length > 0 && (
                                      <label style={{marginLeft: '5px', color: '#1677ff'}}>
                                          ({item.rules.length} rules)
                                      </label>
                                  )}
                              </Space>

                              <label>{item.type}</label>

                              <Space size={3} className="hover-buttons">
                                  <Button
                                      type="text"
                                      icon={<EditOutlined style={{color: token.colorPrimary}}/>}
                                      size="small"
                                      onClick={() => {
                                          setItem(item);
                                          setRules(item.rules || []);
                                          // 设置表单初始值
                                          form.setFieldsValue({
                                              name: item.name,
                                              type: item.type,
                                              rules: item.rules || []
                                          });
                                          setOpen(true);
                                      }}
                                  />
                                  <Button type="text" icon={<DeleteOutlined style={{color: token.colorPrimary}}/>}
                                          size="small" onClick={() => setOpen(false)}/>
                              </Space>
                          </Flex>
                      </List.Item>
                  )}/>
            <Modal width={700}
                   title="编辑变量"
                   open={open}
                   onOk={handleOk}
                   onCancel={() => setOpen(false)}
            >
                <Form form={form} layout="vertical">
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
                    <Form.Item label="校验规则" name='rules'>
                        <List
                            bordered={false}
                            locale={{emptyText: '暂无校验规则'}}
                            dataSource={rules.length > 0 ? rules : (item?.rules || [])}
                            renderItem={(rule: Rule, index: number) => (
                                <List.Item>
                                    <Space size={3}>
                                        <Form.Item
                                            name={['rules', index, 'type']}
                                            noStyle
                                            initialValue={rule.type}
                                        >
                                            <Select 
                                                style={{width: '120px'}}
                                                onChange={(value) => {
                                                    // 当类型改变时，更新表单中的规则类型
                                                    const currentRules = form.getFieldValue('rules') || [];
                                                    const updatedRules = [...currentRules];
                                                    updatedRules[index] = {
                                                        ...updatedRules[index],
                                                        type: value,
                                                        // 如果是 length 或 size 类型，设置默认值为 ','
                                                        value: (value === 'length' || value === 'size') ? ',' : updatedRules[index].value
                                                    };
                                                    form.setFieldsValue({ rules: updatedRules });
                                                    
                                                    // 更新本地状态，以便重新渲染
                                                    const stateRules = [...rules];
                                                    stateRules[index] = {
                                                        ...stateRules[index],
                                                        type: value,
                                                        value: (value === 'length' || value === 'size') ? ',' : stateRules[index].value
                                                    };
                                                    setRules(stateRules);
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
                                        {(rule.type === 'length' || rule.type === 'size') && (
                                            <Form.Item
                                                name={['rules', index, 'value']}
                                                noStyle
                                                initialValue={rule.value || ',' /* 确保有初始值 */}
                                            >
                                                <LengthOrSize />
                                            </Form.Item>
                                        )}
                                        {(rule.type === 'max' || rule.type === 'min' || rule.type === 'enum' || rule.type === 'email' || rule.type === 'pattern') &&
                                            <Form.Item
                                                name={['rules', index, 'value']}
                                                noStyle
                                                initialValue={rule.value}
                                            >
                                                <Input placeholder="请输入校验值" />
                                            </Form.Item>}

                                        <Form.Item
                                            name={['rules', index, 'message']}
                                            noStyle
                                            initialValue={rule.message}
                                        >
                                            <Input placeholder="请输入错误提示" />
                                        </Form.Item>
                                        <Button
                                            type="text"
                                            icon={<MinusCircleOutlined style={{color: token.colorPrimary}}/>}
                                            size="small"
                                            onClick={() => {
                                                const currentRules = form.getFieldValue('rules') || [];
                                                const newRules = [...currentRules];
                                                newRules.splice(index, 1);
                                                form.setFieldsValue({ rules: newRules });
                                                // 保持rules状态同步，用于渲染列表
                                                const stateRules = [...rules];
                                                stateRules.splice(index, 1);
                                                setRules(stateRules);
                                            }}
                                        />
                                    </Space>
                                </List.Item>
                            )}
                        />
                        <Button
                            type="dashed"
                            icon={<PlusOutlined/>}
                            style={{width: "100%"}}
                            size="small"
                            onClick={addRule}
                        >
                            添加校验规则
                        </Button>
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
};

export const LengthOrSize = ({ value, onChange }: { value?: string, onChange?: (value: string) => void }) => {
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
        <Space.Compact style={{ width: '100%' }}>
            <Input placeholder="最小值" value={min} onChange={handleMinChange} />
            <Input placeholder="最大值" value={max} onChange={handleMaxChange} />
        </Space.Compact>
    )
}