import {Button, Card, Flex, Space} from "antd";
import styles from "@/pages/flow/stytles.less";
import {Node, Panel} from "@xyflow/react";
import {nodeConfig} from "@/pages/flow/initNodes";
import React, {ComponentType} from "react";

interface AttributePanelProps {
    open: boolean
    node?: Node,
    onChange: (node: Node) => void
}

export default ({open = false, node, onChange}: AttributePanelProps) => {
    console.log('属性面板:', open, node)
    if (!node || !node.type) return <></>
    // 根据节点类型获取对应的配置
    const config = nodeConfig[node.type as keyof typeof nodeConfig]
    const title = config?.title || '属性'
    const EditComponent = config?.edit as ComponentType<{ node: Node, onChange: (node: Node) => void }> | null
    return <>
        <Panel hidden={!open} position="top-right" className={styles.panel}>
            <Card title={title} variant='borderless' size='small' className={styles.noBorderCard}>
                {EditComponent && <EditComponent node={node} onChange={onChange}/>}
            </Card>
        </Panel>
    </>
}