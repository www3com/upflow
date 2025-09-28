import {Card, Flex, theme} from "antd";
import styles from "@/pages/flow/styles.less";
import React, {DragEvent, MouseEvent} from "react";
import {NodeTypes} from "@/utils/nodeTypes";
import {IconFontUrl} from "@/utils/constants";
import {createFromIconfontCN} from "@ant-design/icons";

const {useToken} = theme;
const IconFont = createFromIconfontCN({
    scriptUrl: IconFontUrl,
});

export default () => {
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
        <Card title='组件面板' variant='borderless' size='small' className={styles.noBorderCard}>
            <Flex wrap gap={4}>
                {Object.keys(NodeTypes).map((nodeType) => (
                    <Flex vertical draggable align={'center'} justify={'center'} gap={5} key={nodeType}
                          className={styles.draggableNode}
                          onDragStart={(event) => onDragStart(event, nodeType)}
                          onMouseEnter={(e) => onMouseEnter(e)}
                          onMouseLeave={(e) => onMouseLeave(e)}>
                        <IconFont type={NodeTypes[nodeType].icon}
                                  style={{fontSize: '22px', color: token.colorPrimary}}/>
                        <span style={{fontSize: '12px'}}>{NodeTypes[nodeType].data.title}</span>
                    </Flex>
                ))}
            </Flex>
        </Card>
    );
}