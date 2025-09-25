import React, {useCallback, useEffect, useMemo} from "react";
import {
    changeConnect,
    changeEdges,
    changeNodes,
    init, addNode,
    state
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
    SelectionMode, useReactFlow
} from "@xyflow/react";
import {NodeTypes} from "@/utils/constants";
import {DnDProvider, useDnD} from "@/pages/flow/components/DnDContext";

const FlowPage = () => {

    const snap = useSnapshot(state);
    const {screenToFlowPosition} = useReactFlow();
    const [type, setType] = useDnD();

    useEffect(() => {
        init()
    }, []);

    const nodeTypes = useMemo(() => {
        return Object.fromEntries(
            Object.entries(NodeTypes).map(([key, value]) => [key, value.node])
        );
    }, []);

    const onNodesChange = useCallback(changeNodes, []);
    const onEdgesChange = useCallback(changeEdges, []);
    const onConnect = useCallback(changeConnect, []);
    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const nodeType = event.dataTransfer?.getData('application/reactflow');
        if (typeof nodeType === 'undefined' || !nodeType) {
            return;
        }
        addNode(nodeType, screenToFlowPosition({x: event.clientX, y: event.clientY}));
    }, [screenToFlowPosition, type]);

    const onSave = useCallback(() => {
        const flowData = {nodes: snap.nodes, edges: snap.edges};
        console.log(JSON.stringify(flowData));
    }, [snap.nodes, snap.edges]);

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
                    nodes={snap.nodes as any}
                    edges={snap.edges as Edge[]}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    selectionMode={SelectionMode.Partial}
                >
                    <Panel position="top-right">
                        <Space>
                            <Button onClick={onSave} color="primary" variant="outlined">运行</Button>
                            <Button type='primary' onClick={onSave}>保存</Button>
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
        <DnDProvider>
            <FlowPage/>
        </DnDProvider>
    </ReactFlowProvider>
);