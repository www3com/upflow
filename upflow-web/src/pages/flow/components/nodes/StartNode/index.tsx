import {Card, Flex, Space, theme} from "antd";
import {memo} from "react";
import {createFromIconfontCN} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";
import styles from './styles.less'
import {NodeTypes} from "@/utils/constants";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";

const IconFont = createFromIconfontCN({
    scriptUrl: '/public/iconfont.js',
});
const {useToken} = theme;

interface StartNodeProps {
    id: string,
    type: string,
    data: {
        title: string,
        input: []
    }
}

export default memo(({id, type, data}: StartNodeProps) => {
    const {token} = useToken();
    if (data.input.length == 0) {
        return <NodeWrapper id={id} type={type} title={data.title}/>
    }
    return (
        <NodeWrapper id={id} type={type} title={data.title}>
            <Flex vertical className='node-container' gap={10}>
                <Flex vertical gap={5}>
                    {data.input.map((item: any, index: number) => (
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