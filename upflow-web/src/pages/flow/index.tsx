import React, {useEffect, useMemo, useState, useCallback} from "react";
import {
    init,
    state, saveFlow, addNode, addComment, exportDSL, importDSL,
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
    Edge,
    Panel,
    ReactFlow,
    ReactFlowProvider,
    SelectionMode,
    useReactFlow
} from "@xyflow/react";
import {NodeTypes} from "@/utils/nodeTypes";
import {useFlow} from "@/pages/flow/hooks/useFlow";
import AttributePanel from "@/pages/flow/components/AttributePanel";
import ZoomControl from "@/pages/flow/components/ZoomControl";
import ContextMenu from "@/pages/flow/components/ContextMenu";


const FlowPage = () => {
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        position: {x: 0, y: 0},
    });

    const {screenToFlowPosition} = useReactFlow();

    const snap = useSnapshot(state);
    const {
        onNodesChange,
        onEdgesChange,
        onConnect,
        onDrop,
        onDragOver,
        onNodeDrag,
        onNodeDragStop,
        onNodeMouseEnter,
        onNodeMouseLeave,
        onValidConnection,
        dropNodeIds,
        hoveredNodeId
    } = useFlow();

    useEffect(() => {
        init()
    }, []);

    const nodeTypes = useMemo(() => {
        return Object.fromEntries(
            Object.entries(NodeTypes).map(([key, value]) => [key, value.node])
        );
    }, []);

    const handleContextMenu = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu({visible: true, position: {x: event.clientX, y: event.clientY}});
    }, []);

    const handleCloseContextMenu = useCallback(() => {
        setContextMenu({visible: false, position: {x: 0, y: 0}});
    }, []);

    const handleAddNode = useCallback((nodeType: string) => {
        const flowPosition = screenToFlowPosition(contextMenu.position);
        addNode(nodeType, flowPosition);
    }, [screenToFlowPosition, contextMenu.position]);

    const handleAddComment = useCallback(() => {
        const flowPosition = screenToFlowPosition(contextMenu.position);
        addComment(flowPosition);
    }, [screenToFlowPosition, contextMenu.position]);

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
                        className: `${node.className} ${dropNodeIds?.includes(node.id) && 'highlight'} ${hoveredNodeId === node.id && 'node-hovered'}`
                    } as Node))}
                    edges={snap.edges.map(edge => ({
                        ...edge,
                        className: `${edge.className} ${hoveredNodeId && (edge.source === hoveredNodeId || edge.target === hoveredNodeId) && 'edge-hovered'}`
                    } as Edge))}
                    onNodeDrag={onNodeDrag}
                    onNodeDragStop={onNodeDragStop}
                    onNodeMouseEnter={onNodeMouseEnter}
                    onNodeMouseLeave={onNodeMouseLeave}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    isValidConnection={onValidConnection}
                    selectionMode={SelectionMode.Partial}
                    selectNodesOnDrag={false}
                    onContextMenu={handleContextMenu}
                >
                    <Panel position="top-right">
                        <Space>
                            <Button onClick={saveFlow} color="primary" variant="outlined">运行</Button>
                            <Button type='primary' onClick={saveFlow}>保存</Button>
                        </Space>
                    </Panel>
                    <AttributePanel/>
                    <ZoomControl/>
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                </ReactFlow>
                <ContextMenu
                    visible={contextMenu.visible}
                    position={contextMenu.position}
                    onClose={handleCloseContextMenu}
                    onContextMenu={handleContextMenu}
                    onAddNode={handleAddNode}
                    onAddComment={handleAddComment}
                    onExportDSL={exportDSL}
                    onImportDSL={importDSL}
                />
            </Splitter.Panel>
        </Splitter>
    );
}

export default () => (
    <ReactFlowProvider>
        <FlowPage/>
    </ReactFlowProvider>
);