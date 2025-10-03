import {Button, Flex, theme, Input, Form} from "antd";
const { TextArea } = Input;
import styles from "./styles.less";
import {Panel} from "@xyflow/react";
import React, {ComponentType, useState, useEffect, useCallback} from "react";
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

export default () => {
    const [maximized, setMaximized] = useState(false);
    const snap = useSnapshot(state);
    const {token} = useToken();
    const [form] = Form.useForm();

    // 直接更新状态的函数
    const updateNodeData = useCallback((values: { title?: string; description?: string }) => {
        if (snap.selectedNode) {
            const nodeIndex = state.nodes.findIndex(n => n.id === snap.selectedNode!.id);
            if (nodeIndex !== -1) {
                state.nodes[nodeIndex] = {
                    ...state.nodes[nodeIndex],
                    data: {
                        ...state.nodes[nodeIndex].data,
                        ...values
                    }
                };
            }
        }
    }, [snap.selectedNode]);

    // 同步表单值与选中节点数据
    useEffect(() => {
        if (snap.selectedNode) {
            form.setFieldsValue({
                title: snap.selectedNode.data.title || '',
                description: snap.selectedNode.data.description || ''
            });
        }
    }, [snap.selectedNode?.id,form]);

    // 处理表单值变更
    const handleFormValuesChange = useCallback((changedValues: any, allValues: any) => {
        updateNodeData(changedValues);
    }, [updateNodeData, form]);

    if (!snap.selectedNode) return <></>
    
    // 根据节点类型获取对应的配置
    const config = NodeTypes[snap.selectedNode.type!]
    const titleIcon = config?.icon

    const title = (
        <div className={styles.titleContainer}>
            {titleIcon && <IconFont type={titleIcon} style={{ color: token.colorPrimary }} />}
            <Form.Item
                name="title"
                style={{ margin: 0, flex: 1 }}
            >
                <Input
                    variant="borderless"
                    className={styles.titleInput}
                    style={{ color: token.colorText }}
                    placeholder="输入标题"
                />
            </Form.Item>
        </div>
    )

    const description = (
        <div className={styles.descriptionContainer}>
            <Form.Item
                name="description"
                style={{ margin: 0 }}
            >
                <TextArea
                    variant="borderless"
                    style={{ color: token.colorTextSecondary, fontSize: '12px' }}
                    placeholder="输入描述"
                    autoSize={{ minRows: 1, maxRows: 4 }}
                />
            </Form.Item>
        </div>
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
            hidden={!snap.selectedNode}
            position="top-right"
            className={`${styles.panel} ${maximized ? styles.maximized : ''}`}
        >
            <ResizablePanel
                defaultWidth={400}
                minWidth={200}
                maxWidth={1200}
                isMaximized={maximized}
            >
                <div className={styles.layout}>
                    {/* Header部分 - 自适应高度 */}
                    <div className={styles.header}>
                        <Form
                            form={form}
                            layout="vertical"
                            onValuesChange={handleFormValuesChange}
                        >
                            <div className={styles.headerTitleRow}>
                                <div className={styles.title} style={{ flex: 1 }}>
                                    {title}
                                </div>
                                <div>
                                    {cardExtra}
                                </div>
                            </div>
                            {description}
                        </Form>
                    </div>
                    
                    {/* Content部分 - 可滚动 */}
                    <div className={styles.content}>
                        {EditComponent && <EditComponent node={snap.selectedNode as NodeType} onChange={handleNodeChange}/>}
                    </div>
                </div>
            </ResizablePanel>
        </Panel>
    </>
}