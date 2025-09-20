import {Card, Flex, theme} from "antd";
import styles from "@/pages/flow/stytles.less";
import React, {DragEvent, MouseEvent} from "react";
import {IconFontUrl, NodeTypes} from "@/utils/constants";
import {createFromIconfontCN} from "@ant-design/icons";

const {useToken} = theme;
const IconFont = createFromIconfontCN({
    scriptUrl: IconFontUrl,
});

interface DraggableNodeProps {
    type: string;
    label: string;
    icon: string;
}

const DraggableNode = ({type, label, icon}: DraggableNodeProps) => {
    const {token} = useToken();
    // 组件拖拽开始
    const onDragStart = (event: DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const onMouseEnter = (event: MouseEvent<HTMLElement>) => {
        event.currentTarget.style.backgroundColor = token.colorBgTextHover;
        event.currentTarget.style.borderColor = token.colorPrimary;
    }

    const onMouseLeave = (event: MouseEvent<HTMLElement>) => {
        event.currentTarget.style.backgroundColor = '#fafafa';
        event.currentTarget.style.borderColor = '#d9d9d9';
    }

    return (
        <Flex vertical draggable align={'center'} justify={'center'} gap={5}
              className={styles.draggableNode}
              onDragStart={(event) => onDragStart(event, type)}
              onMouseEnter={(e) => onMouseEnter(e)}
              onMouseLeave={(e) => onMouseLeave(e)}
        >
            <IconFont type={icon} style={{fontSize: '22px', color: token.colorPrimary}}/>
            <span style={{fontSize: '12px'}}>{label}</span>
        </Flex>
    );
};

export default () => {
    return (
        <Card title='组件面板' variant='borderless' size='small' className={styles.noBorderCard}>
            <Flex wrap gap={4}>
                {Object.keys(NodeTypes).map((nodeType) => (
                    <DraggableNode
                        type={nodeType}
                        key={NodeTypes[nodeType].data.title}
                        label={NodeTypes[nodeType].data.title}
                        icon={NodeTypes[nodeType].icon}
                    />
                ))}
            </Flex>
        </Card>
    );
}