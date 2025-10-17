import React, {useMemo} from 'react';
import {Select, Flex, Space, theme, SelectProps} from 'antd';
import IconFont from '@/components/IconFont';
import {VariableWithNode} from '@/pages/flow/variables';
import {
    CloseCircleOutlined,
} from "@ant-design/icons";

const {useToken} = theme;

// 变量标签组件
interface VariableLabelProps {
    value: string | undefined;
    variablesWithNode: VariableWithNode[];
}

const VariableLabel: React.FC<VariableLabelProps> = ({value, variablesWithNode}) => {
    const {token} = useToken();
    // 查找变量所属的节点
    const variable = variablesWithNode.find(v => v.varId === value);
    if (!variable) {
        return <span style={{color: token.colorTextPlaceholder}}> 请选择变量 </span>;
    }

    return (
        <Flex gap={5}>
            <Flex>
                <IconFont type={variable.nodeIcon}/>
                <span style={{fontWeight: 500}}> {variable?.nodeName}</span>
            </Flex>
            <span style={{color: token.colorText}}>/</span>
            <Flex style={{color: token.colorPrimary, fontWeight: 500}} gap={3}>
                <IconFont type="icon-variable" style={{color: token.colorPrimary}}/>
                {variable.varName}
                {!variable && <CloseCircleOutlined style={{color: 'red'}}/>}
            </Flex>
        </Flex>
    );
};

// VariableSelect 组件属性接口
export interface VariableSelectProps extends Omit<SelectProps, 'options' | 'labelRender' | 'value' | 'onChange' | 'labelInValue'> {
    value?: string;
    onChange?: (value: string) => void;
    variablesWithNode: VariableWithNode[];
}

const VariableSelect: React.FC<VariableSelectProps> = ({
                                                           variablesWithNode,
                                                           value,
                                                           onChange,
                                                           ...selectProps
                                                       }) => {
    const {token} = useToken();

    // 创建选项
    const options = useMemo(() => {
        // 按节点名称分组
        const groupedVariables = variablesWithNode.reduce((groups, variable) => {
            const {nodeName} = variable;
            if (!groups[nodeName]) {
                groups[nodeName] = [];
            }
            groups[nodeName].push(variable);
            return groups;
        }, {} as Record<string, VariableWithNode[]>);

        // 转换为 options 格式
        return Object.entries(groupedVariables).map(([nodeName, nodeVariables]) => ({
            label: (
                <Space>
                    <IconFont type={nodeVariables[0]?.nodeIcon} style={{color: token.colorPrimary}}/> {nodeName}
                </Space>
            ),
            options: nodeVariables.map((variable) => ({
                label: (
                    <Space>
                        <IconFont type="icon-variable" style={{color: token.colorPrimary}}/>
                        {variable.varName}
                    </Space>
                ),
                value: variable.varId
            }))
        }));
    }, [variablesWithNode, token]);

    // 处理值变化
    const handleChange = (selectedValue: string) => {
        if (onChange && selectedValue) {
            onChange(selectedValue)
        }
    };

    // 创建标签渲染函数
    const labelRender = useMemo(() => {
        return () => (<VariableLabel value={value} variablesWithNode={variablesWithNode}/>);
    }, [value, variablesWithNode]);

    return <Select
        popupMatchSelectWidth={false}
        placeholder="请选择变量"
        labelInValue
        value={value}
        onChange={handleChange}
        options={options}
        labelRender={labelRender}
        {...selectProps}
    />;
}

export default VariableSelect;