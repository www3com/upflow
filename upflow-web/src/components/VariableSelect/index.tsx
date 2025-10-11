import React, {useMemo} from 'react';
import {Select, Flex, Space, theme, SelectProps} from 'antd';
import IconFont from '@/components/IconFont';
import {VariableWithNode} from '@/utils/variables';
import {
    CloseCircleOutlined,
} from "@ant-design/icons";

const {useToken} = theme;

// 变量标签组件
interface VariableLabelProps {
    value: string;
    variablesWithNode: VariableWithNode[];
    token: any;
}

const VariableLabel: React.FC<VariableLabelProps> = ({value, variablesWithNode, token}) => {
    // 如果没有选择，显示请选择变量
    if (!value) {
        return <span style={{color: token.colorTextPlaceholder}}> 请选择变量 </span>;
    }

    // 查找变量所属的节点
    const variable = variablesWithNode.find(v => v.varName === value);

    return (
        <Flex gap={5}>
            <Flex>
                {variable &&
                    <> <IconFont type={variable.nodeIcon}/>
                        <span style={{fontWeight: 500}}> {variable?.nodeName}</span>
                    </>
                }
            </Flex>
            <span style={{color: token.colorText}}>/</span>
            <Flex style={{color: token.colorPrimary, fontWeight: 500}} gap={3}>
                <IconFont type="icon-variable" style={{color: token.colorPrimary}}/>
                {value}
                {!variable && <CloseCircleOutlined style={{color: 'red'}}/>}
            </Flex>
        </Flex>
    );
};

// 创建选择器选项
const createSelectOptions = (variables: VariableWithNode[], token: any): SelectProps['options'] => {
    // 按节点名称分组
    const groupedVariables = variables.reduce((groups, variable) => {
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
            value: variable.varName
        }))
    }));
};

// VariableSelect 组件属性接口
export interface VariableSelectProps extends Omit<SelectProps, 'options' | 'labelRender'> {
    /** 可用的变量列表 */
    variablesWithNode: VariableWithNode[];
    /** 当前选中的值 */
    value?: string;
    /** 值变化回调 */
    onChange?: (value: string) => void;
    /** 是否显示变量标签渲染 */
    showVariableLabel?: boolean;
}

const VariableSelect: React.FC<VariableSelectProps> = ({
                                                           variablesWithNode,
                                                           value,
                                                           onChange,
                                                           showVariableLabel = true,
                                                           ...selectProps
                                                       }) => {
    const {token} = useToken();

    // 创建选项
    const options = useMemo(() => {
        return createSelectOptions(variablesWithNode, token);
    }, [variablesWithNode, token]);

    // 创建标签渲染函数
    const labelRender = useMemo(() => {
        if (!showVariableLabel) {
            return undefined;
        }

        return () => {
            return (
                <VariableLabel
                    value={value || ''}
                    variablesWithNode={variablesWithNode}
                    token={token}
                />
            );
        };
    }, [showVariableLabel, value, variablesWithNode, token]);

    return (
        <Select
            popupMatchSelectWidth={false}
            placeholder="请选择变量"
            {...selectProps}
            value={value}
            onChange={onChange}
            options={options}
            labelRender={labelRender}
        />
    );
};

export default VariableSelect;