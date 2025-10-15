import {Button, Flex, List, Space, theme} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined
} from "@ant-design/icons";
import IconFont from '@/components/IconFont';
import './styles.less';

import EditStartDialog from "@/pages/flow/components/nodes/StartNode/EditStartDialog";
import {Node} from "@xyflow/react";
import {useState} from "react";
import {Variable} from "@/typings";


const {useToken} = theme;

interface StartNodeProps {
    node: Node,
    onChange: (node: Node) => void
}

export default ({node, onChange}: StartNodeProps) => {
    const [open, setOpen] = useState(false);
    const [variable, setVariable] = useState<Variable>({} as Variable);
    const {token} = useToken();
    const onEdit = (variable: Variable) => {
        setOpen(true);
        setVariable(variable);
    }
    const onUpdate = (variable: Variable) => {
        // 获取变量数据
        let variables = (node.data.variables || []) as Variable[];
        console.log('variable:', variable)
        // 检查是否是更新现有变量还是添加新变量
        const existingIndex = variables.findIndex(v => v.name === variable.name);
        if (existingIndex >= 0) {
            // 更新现有变量
            variables[existingIndex] = variable;
        } else {
            // 添加新变量
            variables.push(variable);
        }

        let data = {
            ...node.data,
            variables: variables
        };
        let startNode = {...node, data};
        console.log('startNode:', startNode)
        onChange(startNode);
        setOpen(false);
    }

    const onDelete = (variable: Variable) => {
        // 获取变量数据
        let variables = (node.data.variables || []) as Variable[];
        let filteredVariables = variables.filter(v => v.name !== variable.name);
        let data = {
            ...node.data,
            variables: filteredVariables
        };
        let startNode = {...node, data};
        onChange(startNode);
    }

    // 获取变量数据
    const variables = (node.data.variables || []) as Variable[];

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
                              <Space size={3}><IconFont type="icon-variable"/>{item.name}
                                  {item.rules && (
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
                                      onClick={() => onEdit(item)}
                                  />
                                  <Button type="text" icon={<DeleteOutlined style={{color: token.colorPrimary}}/>}
                                          size="small" onClick={() => onDelete(item)}/>
                              </Space>
                          </Flex>
                      </List.Item>
                  )}/>
            {open && <EditStartDialog open={open} variable={variable} onCancel={() => setOpen(false)}
                                      onUpdate={onUpdate}/>}
        </>
    )
};