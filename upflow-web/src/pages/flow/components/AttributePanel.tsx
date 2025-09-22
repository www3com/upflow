import {Button, Card} from "antd";
import styles from "@/pages/flow/stytles.less";
import {Node, Panel} from "@xyflow/react";
import React, {ComponentType, useState} from "react";
import ResizablePanel from "@/components/ResizablePanel";
import {ExpandOutlined, CompressOutlined} from '@ant-design/icons';
import {NodeTypes} from "@/utils/constants";

interface AttributePanelProps {
    open: boolean
    node?: Node,
    onChange: (node: Node) => void
}

export default ({open = false, node, onChange}: AttributePanelProps) => {
    const [maximized, setMaximized] = useState(false);

    if (!node || !node.type) return <></>
    // 根据节点类型获取对应的配置
    const config = NodeTypes[node.type]
    const title = config?.data?.title || '属性'
    const EditComponent = config?.attr as ComponentType<{ node: Node, onChange: (node: Node) => void }> | null

    const cardExtra = (
        <Button
            type="text"
            size="small"
            icon={maximized ? <CompressOutlined/> : <ExpandOutlined/>}
            onClick={()=> setMaximized(!maximized)}
            title={maximized ? "还原" : "最大化"}
        />
    );

    return <>
        <Panel
            hidden={!open}
            position="top-right"
            className={`${styles.attrPanel} ${maximized ? styles.maximized : ''}`}
        >
            <ResizablePanel
                defaultWidth={400}
                minWidth={200}
                maxWidth={1200}
                isMaximized={maximized}
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
            </ResizablePanel>
        </Panel>
    </>
}