import {Button, Flex, Layout, theme} from "antd";
import styles from "@/pages/flow/styles.less";
import {Panel} from "@xyflow/react";
import React, {ComponentType, useState} from "react";
import ResizablePanel from "@/components/ResizablePanel";
import {ExpandOutlined, CompressOutlined} from '@ant-design/icons';
import {NodeTypes} from "@/utils/nodeTypes";
import {state} from '@/states/flow';
import {useSnapshot} from "valtio";
import {NodeType} from "@/typings";
import IconFont from "@/components/IconFont";

const handleNodeChange = (node: NodeType) => {
    console.log('node', node)
    // 更新节点数据的逻辑
    const nodeIndex = state.nodes.findIndex(n => n.id === node.id);
    if (nodeIndex !== -1) {
        state.nodes[nodeIndex] = {
            ...state.nodes[nodeIndex],
            data: node.data as any
        };
        // 同时更新选中的节点
        state.selectedNode = node;
    }
};

const {useToken} = theme;
const {Header, Content} = Layout;

export default () => {
    const [maximized, setMaximized] = useState(false);
    const snap = useSnapshot(state);
    const {token} = useToken();

    if (!snap.selectedNode) return <></>
    // 根据节点类型获取对应的配置
    const config = NodeTypes[snap.selectedNode.type!]
    const titleText = snap.selectedNode.data.title || '属性'
    const titleIcon = config?.icon
    const title = (
        <Flex align="center" gap={8}>
            {titleIcon && <IconFont type={titleIcon} style={{ color: token.colorPrimary }} />}
            {titleText}
        </Flex>
    )
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
                <Layout className={styles.attributeLayout}>
                    {/* Header部分 - 固定高度 */}
                    <Header className={styles.attributeHeader}>
                        <Flex justify="space-between" align="center" className={styles.attributeHeaderContent}>
                            <div className={styles.attributeTitle}>
                                {title}
                            </div>
                            <div>
                                {cardExtra}
                            </div>
                        </Flex>
                    </Header>
                    
                    {/* Content部分 - 可滚动 */}
                    <Content className={styles.attributeContent}>
                        {EditComponent && <EditComponent node={snap.selectedNode as NodeType} onChange={handleNodeChange}/>}
                    </Content>
                </Layout>
            </ResizablePanel>
        </Panel>
    </>
}