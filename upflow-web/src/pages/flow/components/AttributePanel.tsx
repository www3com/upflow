import {Button, Card, Flex, Space} from "antd";
import styles from "@/pages/flow/stytles.less";
import {Node, Panel} from "@xyflow/react";
import React, {ComponentType, useState} from "react";
import Index from "@/pages/flow/components/ResizabledPanel";
import { ExpandOutlined, CompressOutlined } from '@ant-design/icons';
import {NodeTypes} from "@/utils/constants";

interface AttributePanelProps {
    open: boolean
    node?: Node,
    onChange: (node: Node) => void
}

export default ({open = false, node, onChange}: AttributePanelProps) => {
    const [isMaximized, setIsMaximized] = useState(false);
    
    console.log('属性面板:', open, node)
    
    if (!node || !node.type) return <></>
    // 根据节点类型获取对应的配置
    const config = NodeTypes[node.type]
    const title = config?.title || '属性'
    const EditComponent = config?.attr as ComponentType<{ node: Node, onChange: (node: Node) => void }> | null
    
    const handleMaximizeToggle = () => {
        setIsMaximized(!isMaximized);
    };

    const cardExtra = (
        <Button 
            type="text" 
            size="small"
            icon={isMaximized ? <CompressOutlined /> : <ExpandOutlined />}
            onClick={handleMaximizeToggle}
            title={isMaximized ? "还原" : "最大化"}
        />
    );
    
    return <>
        <Panel 
            hidden={!open} 
            position="top-right" 
            className={`${styles.attrPanel} ${isMaximized ? styles.maximized : ''}`}
        >
            <Index
                defaultWidth={400}
                minWidth={200}
                maxWidth={1200}
                style={{ height: '100%' }}
                isMaximized={isMaximized}
            >
                <Card 
                    title={title} 
                    variant='borderless' 
                    size='small' 
                    className={styles.noBorderCard}
                    extra={cardExtra}
                >
                    {EditComponent && <EditComponent node={node} onChange={onChange}/>}
                </Card>
            </Index>
        </Panel>
    </>
}