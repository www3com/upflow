import {Flex, Space, theme} from "antd";
import {memo} from "react";
import {Handle, Position} from "@xyflow/react";
import styles from './styles.less'
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import IconFont from '@/components/IconFont';
import {NodeType} from "@/typings";
import {getVariableTypeLabel} from "@/pages/flow/variables";
import NodeResizeControl from "@/pages/flow/components/NodeResizeControl";

const {useToken} = theme;


export default memo((node: NodeType) => {
    const {token} = useToken();
    // 获取变量数据
    const variables = node.data.variables || [];
    
    return (
        <NodeWrapper node={node}>
            {variables.length > 0 && (
                <Flex vertical className='node-container' gap={10}>
                    <Flex vertical gap={5}>
                        {variables.map((item: any) => (
                            <Flex justify="space-between" align="center" className={styles.variable} key={item.name}>
                                <Space size={3}>
                                    <IconFont type="icon-variable" style={{color: token.colorPrimary}}/>
                                    {item.name}
                                    {item.rules && item.rules.length > 0 && (
                                        <label style={{marginLeft: '5px', color: '#1677ff'}}>
                                            ({item.rules.length} rules)
                                        </label>
                                    )}
                                </Space>
                                <label className={styles.rules}>{getVariableTypeLabel(item.type)}</label>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            )}
            <Handle type="source" position={Position.Right}/>
            <NodeResizeControl/>
        </NodeWrapper>
    )
});