import {Card, Flex, theme} from "antd";
import styles from "./styles.less";
import React, {DragEvent, MouseEvent} from "react";
import {NodeDefineTypes} from "@/pages/flow/nodeTypes";
import IconFont from '@/components/IconFont';

const {useToken} = theme;

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
        <Card title='组件面板' variant='borderless' size='small' className={styles.card}>
                    <Flex wrap gap={4}>
                        {Object.keys(NodeDefineTypes)
                            .filter(nodeType => !NodeDefineTypes[nodeType].defaultConfig?.data.hidden)
                            .map((nodeType) => (
                            <Flex vertical draggable align={'center'} justify={'center'} gap={5} key={nodeType}
                                  className={styles.draggableNode}
                          onDragStart={(event) => onDragStart(event, nodeType)}
                          onMouseEnter={(e) => onMouseEnter(e)}
                          onMouseLeave={(e) => onMouseLeave(e)}>
                        <IconFont type={NodeDefineTypes[nodeType].icon}
                                  style={{fontSize: '22px', color: token.colorPrimary}}/>
                        <span style={{fontSize: '12px'}}>{NodeDefineTypes[nodeType].defaultConfig?.data.title}</span>
                    </Flex>
                ))}
            </Flex>
        </Card>
    );
}