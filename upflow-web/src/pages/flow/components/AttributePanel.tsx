import {Button, Card} from "antd";
import styles from "@/pages/flow/styles.less";
import {Panel} from "@xyflow/react";
import React, {ComponentType, useState} from "react";
import ResizablePanel from "@/components/ResizablePanel";
import {ExpandOutlined, CompressOutlined} from '@ant-design/icons';
import {NodeTypes} from "@/utils/constants";
import {state} from '@/states/flow';
import {useSnapshot} from "valtio";
import {NodeType} from "@/typings";


export default () => {
    const [maximized, setMaximized] = useState(false);
    const snap = useSnapshot(state);

    if (!snap.selectedNode) return <></>
    // 根据节点类型获取对应的配置
    const config = NodeTypes[snap.selectedNode.type!]
    const title = snap.selectedNode.data.title || '属性'
    const EditComponent = config?.attr as ComponentType<{ node: NodeType, onChange?: (node: NodeType) => void }> | null

    const cardExtra = (
        <Button
            type="text"
            size="small"
            icon={maximized ? <CompressOutlined/> : <ExpandOutlined/>}
            onClick={() => setMaximized(!maximized)}
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
                    {EditComponent && <EditComponent node={snap.selectedNode as NodeType}/>}
                </Card>
            </ResizablePanel>
        </Panel>
    </>
}