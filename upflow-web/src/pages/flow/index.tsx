import React, {useEffect, useMemo} from "react";
import {
    init,
    state, saveFlow,
} from "@/states/flow";
import {useSnapshot} from "valtio";
import '@xyflow/react/dist/style.css';
import './xy-theme.css';
import {Button, Space, Splitter} from "antd";
import NodePanel from "@/pages/flow/components/NodePanel";
import {
    Node,
    Background,
    BackgroundVariant,
    Controls,
    Edge,
    Panel,
    ReactFlow,
    ReactFlowProvider,
    SelectionMode
} from "@xyflow/react";
import {NodeTypes} from "@/utils/constants";
import {useFlow} from "@/pages/flow/components/hooks/useFlow";


const FlowPage = () => {

    const snap = useSnapshot(state);
    const {
        onNodesChange,
        onEdgesChange,
        onConnect,
        onDrop,
        onDragOver,
        onNodeDrag,
        onNodeDragStop,
        dropNodeIds
    } = useFlow();

    useEffect(() => {
        init()
    }, []);

    const nodeTypes = useMemo(() => {
        return Object.fromEntries(
            Object.entries(NodeTypes).map(([key, value]) => [key, value.node])
        );
    }, []);

    return (
        <Splitter style={{height: '100%'}}>
            <Splitter.Panel defaultSize="160" min='5%' max="20%"
                            collapsible={{start: false, end: true, showCollapsibleIcon: 'auto'}}>
                <NodePanel/>
            </Splitter.Panel>
            <Splitter.Panel>
                <ReactFlow
                    proOptions={{hideAttribution: true}}
                    nodeTypes={nodeTypes}
                    nodes={snap.nodes.map(node => ({
                        ...node,
                        className: `${node.className} ${dropNodeIds?.includes(node.id) ? 'highlight' : ''}`
                    } as Node))}
                    edges={snap.edges as Edge[]}
                    onNodeDrag={onNodeDrag}
                    onNodeDragStop={onNodeDragStop}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    selectionMode={SelectionMode.Partial}
                    selectNodesOnDrag={false}
                >
                    <Panel position="top-right">
                        <Space>
                            <Button onClick={saveFlow} color="primary" variant="outlined">运行</Button>
                            <Button type='primary' onClick={saveFlow}>保存</Button>
                        </Space>
                    </Panel>
                    <Controls showInteractive={false} orientation={"horizontal"}/>
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                </ReactFlow>
            </Splitter.Panel>
        </Splitter>
    );
}

export default () => (
    <ReactFlowProvider>
        <FlowPage/>
    </ReactFlowProvider>
);