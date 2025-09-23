import {Flex, Layout, theme} from "antd";
import {memo, useState} from "react";
import {createFromIconfontCN} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";
import styles from './styles.less'
import {NodeTypes} from "@/utils/constants";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import NodeResizeControl from "@/pages/flow/components/NodeResizeControl";

const IconFont = createFromIconfontCN({
    scriptUrl: 'https://at.alicdn.com/t/c/font_5021436_vb3zfi9bjm.js',
});
const {useToken} = theme;

interface ForNodeProps {
    id: string,
    type: string,
    selected: boolean,
    data: {
        title: string,
        input: []
    }
}

export default memo((props: ForNodeProps) => {
    const {token} = useToken();
    const [hovered, setHovered] = useState(false);
    return (
        <NodeWrapper {...props}>
            <Flex vertical justify={'start'} className={styles.forContainer} onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}>
                <NodeResizeControl show={hovered || props.selected}/>
                <Layout className={styles.layout}>
                    <Layout.Header className={styles.header}>
                        <IconFont type={NodeTypes[props.type].icon} style={{color: token.colorPrimary, fontSize: 16}}/>
                        <span>{props.data.title}</span>
                    </Layout.Header>
                    <Layout.Content>

                    </Layout.Content>
                </Layout>
                <Handle type="source" position={Position.Right}/>
                <Handle type="target" position={Position.Left}/>
                <Handle type="source" position={Position.Right}/>
            </Flex>
        </NodeWrapper>
    )
});