import {Card, Flex, Space, theme} from "antd";
import {memo, useState} from "react";
import {createFromIconfontCN} from "@ant-design/icons";
import {Handle, NodeResizeControl, Position} from "@xyflow/react";
import styles from './styles.less'
import {NodeTypes} from "@/utils/constants";

const IconFont = createFromIconfontCN({
    scriptUrl: 'https://at.alicdn.com/t/c/font_5021436_vb3zfi9bjm.js',
});
const {useToken} = theme;

interface StartNodeProps {
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

export default memo(({type, selected, data}: StartNodeProps) => {

    console.log('StartNode', type, selected, data)
    const {token} = useToken();
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (

        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <NodeResizeControl style={controlStyle} minWidth={100} minHeight={50}>
                {(selected || hovered) &&<IconFont type='icon-zoom' style={{color: token.colorPrimary, position: 'absolute', right: 5, bottom: 5}}/>}
            </NodeResizeControl>

            <Flex vertical>
                <Space className={styles.title} size={5} align={"start"}>
                    <IconFont type={NodeTypes[type].icon} style={{color: token.colorPrimary, fontSize: 16}}/>
                    {data.title}
                </Space>
                <Flex vertical gap={5}>
                    内容
                </Flex>
                <Handle type="source" position={Position.Right}/>
            </Flex>

            <Handle type="target" position={Position.Left}/>
            <Handle type="source" position={Position.Right}/>
        </div>

    )
});