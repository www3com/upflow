import {
    Node,
    Edge,
    Background,
    Controls,
    ReactFlow,
    addEdge, Panel, BackgroundVariant, useNodesState, useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useCallback, useEffect, useState} from 'react';
import {nodeTypes} from './initNodes';
import './xy-theme.css'
import {Button, Flex, Space} from "antd";
import {getFlow} from "@/services/flow";
import styles from './stytles.less'
import PropsPanel, {AttributePanelProps} from "@/pages/flow/components/AttributePanel";
import {useSnapshot} from 'valtio';
import {flowState, setAttr} from "@/states/flow";

export default () => {
    const init = async () => {
        var res = await getFlow()
        var flow = res.data!
        setNodes(flow.nodes)
        setEdges(flow.edges)
    }

    useEffect(() => {
        init()
    }, [])

    const stat = useSnapshot(flowState)
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const onConnect = useCallback(
        (params: any) => setEdges((eds: any[]) => addEdge(params, eds)),
        [setEdges]
    );

    const onSelectionChange = useCallback(({nodes: selectedNodes}: { nodes: Node[] }) => {
        if (selectedNodes.length == 0) {
            setAttr({open: false})
        }else {
            setAttr({
                open: true,
                node: selectedNodes[0]
            })
        }
    }, []);

    const onSave = useCallback(() => {
        const flowData = {nodes, edges};
        console.log(JSON.stringify(flowData))
    }, [nodes, edges]);

    return (
        <div style={{width: '100%', height: '100%'}}>
            <ReactFlow
                proOptions={{hideAttribution: true}}
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
            >
                <Panel position="top-right">
                    <Space>
                        <Button onClick={onSave} color="primary" variant="outlined">预览</Button>
                        <Button type='primary' onClick={onSave}>保存</Button>
                    </Space>
                </Panel>
                <PropsPanel open={stat.attr.open} node={stat.attr.node}/>
                <Controls/>
                <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
            </ReactFlow>
        </div>
    );
}
