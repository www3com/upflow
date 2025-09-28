import {Flex, Space, theme} from "antd";
import {memo} from "react";
import {createFromIconfontCN} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";
import styles from './styles.less'
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import {IconFontUrl} from "@/utils/constants";
import {NodeType} from "@/typings";

const IconFont = createFromIconfontCN({
    scriptUrl: IconFontUrl,
});
const {useToken} = theme;


export default memo((node: NodeType) => {
    const {token} = useToken();
    if (node.data.input && node.data.input.length == 0) {
        return <NodeWrapper node={node}/>
    }
    return (
        <NodeWrapper node={node}>
            <Flex vertical className='node-container' gap={10}>
                <Flex vertical gap={5}>
                    {node.data.input && node.data.input.map((item: any) => (
                        <Flex justify="space-between" align="center" className={styles.variable} key={item.name}>
                            <Space size={3}><IconFont type="icon-variable"
                                                      style={{color: token.colorPrimary}}/>{item.name}</Space>
                            <label className={styles.rules}>{item.type}</label>
                        </Flex>
                    ))}
                </Flex>
                <Handle type="source" position={Position.Right}/>
            </Flex>
        </NodeWrapper>
    )
});