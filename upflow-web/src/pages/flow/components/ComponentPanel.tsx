import {Card, Flex} from "antd";
import styles from "@/pages/flow/stytles.less";
import {Node} from "@xyflow/react";
import React, {DragEvent} from "react";
import {IconFontUrl, NodeTypes} from "@/utils/constants";
import {createFromIconfontCN} from "@ant-design/icons";

const IconFont = createFromIconfontCN({
    scriptUrl: IconFontUrl,
});

interface ComponentPanelProps {
    node?: Node,
    onChange: (node: Node) => void
}

interface DraggableNodeProps {
    type: string;
    label: string;
    icon: string;
}

const DraggableNode = ({type, label, icon}: DraggableNodeProps) => {
    // 组件拖拽开始
    const onDragStart = (event: DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className={styles.draggableNode}
            onDragStart={(event) => onDragStart(event, type)}
            draggable
            style={{
                padding: '8px 12px',
                margin: '4px 0',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#fafafa',
                transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e6f7ff';
                e.currentTarget.style.borderColor = '#1890ff';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
                e.currentTarget.style.borderColor = '#d9d9d9';
            }}
        >
            <IconFont type={icon} style={{fontSize: '19px', color: '#1890ff'}}/>
            <span style={{fontSize: '14px'}}>{label}</span>
        </div>
    );
};

export default ({node, onChange}: ComponentPanelProps) => {
    return (
        <Card title='组件面板' variant='borderless' size='small' className={styles.noBorderCard}>
            <Flex vertical gap={4}>
                {Object.keys(NodeTypes).map((nodeType) => (
                    <DraggableNode
                        key={NodeTypes[nodeType].title}
                        type={nodeType}
                        label={NodeTypes[nodeType].title}
                        icon={NodeTypes[nodeType].icon}
                    />
                ))}
            </Flex>
        </Card>
    );
}