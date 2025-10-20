import {Button, Flex, List, Space, theme} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import IconFont from '@/components/IconFont';
import './styles.less';

import EditStartDialog from "@/pages/flow/components/nodes/StartNode/EditStartDialog";
import {useState} from "react";
import {NodeType, StartNodeType, Variable} from "@/typings";
import {getVariableTypeLabel} from "@/pages/flow/variables";


const {useToken} = theme;

interface StartNodeProps {
    node: NodeType<StartNodeType>,
    onChange: (node: NodeType<StartNodeType>) => void
}

export default ({node, onChange}: StartNodeProps) => {
    const {token} = useToken();
    const [open, setOpen] = useState(false);
    const [variable, setVariable] = useState<Variable>({} as Variable);

    const onEdit = (variable: Variable) => {
        setOpen(true);
        setVariable(variable);
    }
    const onUpdate = (variable: Variable) => {
        // 获取变量数据并创建副本
        const originalVariables = node.data.input || [];
        let variables = [...originalVariables]; // 创建数组副本
        console.log('variable:', variable)
        // 检查是否是更新现有变量还是添加新变量
        const existIndex = variables.findIndex(v => v.name === variable.name);
        if (existIndex >= 0) {
            variables[existIndex] = variable;
        } else {
            variables.push(variable);
        }

        let data = {
            ...node.data,
            input: variables
        };
        let startNode = {...node, data};
        onChange(startNode);
        setOpen(false);
    }

    const onDelete = (variable: Variable) => {
        // 获取变量数据并创建副本
        const originalVariables = node.data.input || [];
        let filteredVariables = originalVariables.filter(v => v.name !== variable.name);
        let data = {
            ...node.data,
            input: filteredVariables
        };
        let startNode = {...node, data};
        onChange(startNode);
    }

    // 获取变量数据
    const variables = (node.data.input || []);

    return (<>
            <List size={"small"}
                  bordered={false}
                  dataSource={variables}
                  footer={
                      <Button
                          type="dashed"
                          icon={<PlusOutlined/>}
                          style={{width: "100%"}}
                          size="small"
                          onClick={() => {
                              setOpen(true)
                              setVariable({} as Variable)
                          }}
                      />
                  }
                  renderItem={(item: Variable) => (
                      <List.Item>
                          <Flex justify={"space-between"} style={{width: "100%"}} className="type-container">
                              <Space size={3}><IconFont type="icon-variable"/>
                                  {item.name}
                                  {item.rules && (
                                      <label style={{marginLeft: '5px', color: '#1677ff'}}>
                                          ({item.rules.length} rules)
                                      </label>
                                  )}
                              </Space>
                              <label>{getVariableTypeLabel(item.type)}</label>
                              <Space size={3} className="hover-buttons">
                                  <Button
                                      type="text"
                                      icon={<EditOutlined style={{color: token.colorPrimary}}/>}
                                      size="small"
                                      onClick={() => onEdit(item)}
                                  />
                                  <Button type="text" icon={<DeleteOutlined style={{color: token.colorPrimary}}/>}
                                          size="small" onClick={() => onDelete(item)}/>
                              </Space>
                          </Flex>
                      </List.Item>
                  )}/>
            {open && <EditStartDialog open={open}
                                      variable={variable}
                                      onCancel={() => setOpen(false)}
                                      onUpdate={onUpdate}/>}
        </>
    )
};