import {
    Background,
    Controls,
    ReactFlow,
    Panel, BackgroundVariant, ReactFlowProvider, Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './xy-theme.css'
import {Button, Space, Splitter} from "antd";
import AttributePanel from "@/pages/flow/components/AttributePanel";
import ComponentPanel from "@/pages/flow/components/ComponentPanel";
import {useFlow} from "@/pages/flow/hooks/useFlow";
import {flowActions} from "@/states/flow";

const FlowPage = () => {
    const {
        open,
        node,
        nodes,
        edges,
        reactFlowWrapper,
        onNodeClick,
        onPaneClick,
        onNodeDragStart,
        onNodeDrag,
        onNodeDragStop,
        onDragOver,
        onDrop,
        onSave,
        onChange,
        nodeTypes,
        dropTarget
    } = useFlow();

    const {onNodesChange, onEdgesChange, onConnect} = flowActions;

    return (
        <Splitter style={{height: '100%'}}>
            <Splitter.Panel defaultSize="160" min='5%' max="20%"
                            collapsible={{start: false, end: true, showCollapsibleIcon: 'auto'}}>
                <ComponentPanel/>
            </Splitter.Panel>
            <Splitter.Panel>
                <div ref={reactFlowWrapper} style={{width: '100%', height: '100%'}}>
                    <ReactFlow
                        proOptions={{hideAttribution: true}}
                        nodeTypes={nodeTypes}
                        nodes={nodes.map(node => ({
                            ...node,
                            className: `${node.className || ''} ${dropTarget === node.id ? 'drop-target' : ''}`.trim()
                        }))}
                        edges={edges as Edge[]}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        onNodeDragStart={onNodeDragStart}
                        onNodeDrag={onNodeDrag}
                        onNodeDragStop={onNodeDragStop}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        selectNodesOnDrag={false}
                        style={{position: 'relative'}}
                    >
                        <Panel position="top-right">
                            <Space>
                                <Button onClick={onSave} color="primary" variant="outlined">运行</Button>
                                <Button type='primary' onClick={onSave}>保存</Button>
                            </Space>
                        </Panel>


                        <AttributePanel open={open} node={node} onChange={onChange}/>
                        <Controls/>
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                    </ReactFlow>
                </div>
            </Splitter.Panel>
        </Splitter>
    );
}

export default () => (
    <ReactFlowProvider>
        <FlowPage/>
    </ReactFlowProvider>
);