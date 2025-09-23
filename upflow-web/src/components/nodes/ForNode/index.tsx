import {Flex, Layout, theme} from "antd";
import {memo, useState} from "react";
import {createFromIconfontCN} from "@ant-design/icons";
import {Handle, NodeResizeControl, Position} from "@xyflow/react";
import styles from './styles.less'
import {NodeTypes} from "@/utils/constants";
import NodeMenu from "@/components/NodeMenu";

const IconFont = createFromIconfontCN({
    scriptUrl: 'https://at.alicdn.com/t/c/font_5021436_vb3zfi9bjm.js',
});
const {useToken} = theme;

interface ForNodeProps {
    type: string,
    selected: boolean,
    data: {
        title: string,
        input: []
    }
}

const controlStyle = {
    background: 'transparent',
    border: 'none',
};

export default memo(({type, selected, data}: ForNodeProps) => {

    const {token} = useToken();
    const [hovered, setHovered] = useState(false);

    const onSelect = (key: string) => {
        console.log('selected', key);
    };

    return (
        <>
            <NodeMenu onSelect={onSelect}/>
            <Flex vertical justify={'start'} className={styles.forContainer} onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}>
                <NodeResizeControl style={controlStyle} minWidth={100} minHeight={50}>
                    {(selected || hovered) && <IconFont type='icon-zoom' style={{
                        color: token.colorPrimary,
                        position: 'absolute',
                        right: 5,
                        bottom: 5
                    }}/>}
                </NodeResizeControl>
                <Layout className={styles.layout}>
                    <Layout.Header className={styles.header}>
                        <IconFont type={NodeTypes[type].icon} style={{color: token.colorPrimary, fontSize: 16}}/>
                        <span>{data.title}</span>
                    </Layout.Header>
                    <Layout.Content>

                    </Layout.Content>
                </Layout>


                <Handle type="source" position={Position.Right}/>

                <Handle type="target" position={Position.Left}/>
                <Handle type="source" position={Position.Right}/>
            </Flex>
        </>
    )
});