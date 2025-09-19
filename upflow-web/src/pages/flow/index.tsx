import {
    Node,
    Edge,
    Background,
    Controls,
    ReactFlow,
    addEdge, Panel, BackgroundVariant, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useCallback, useEffect, useState, useRef, DragEvent, useMemo} from 'react';
import './xy-theme.css'
import {Button, Space,  Splitter} from "antd";
import AttributePanel from "@/pages/flow/components/AttributePanel";
import { nanoid } from 'nanoid';
import {getFlowApi} from "@/services/flow";
import {NodeTypes} from "@/utils/constants";
import ComponentPanel from "@/pages/flow/components/ComponentPanel";

const FlowPage = () => {
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<Node>();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();

    const init = async () => {
        const res = await getFlowApi();
        setNodes(res.data!.nodes);
        setEdges(res.data!.edges);
    }

    useEffect(() => {
        init();
    }, [])


    const onConnect = useCallback(
        (params: any) => setEdges((eds: any[]) => addEdge(params, eds)),
        [setEdges]
    );

    const onSelectionChange = useCallback(({nodes: selectedNodes}: { nodes: Node[] }) => {
        if (selectedNodes.length == 0) {
            setOpen(false);
            return;
        }
        setOpen(true);
        setNode(selectedNodes[0]);
    }, []);

    const onSave = useCallback(() => {
        const flowData = {nodes, edges};
        console.log(JSON.stringify(flowData))
    }, [nodes, edges]);

    const onChange = (updatedNode: Node) => {

        // 更新节点数组中对应的节点
        setNodes((nds) => nds.map((n) => n.id === updatedNode.id ? updatedNode : n));

        // 同步更新当前选中的节点状态，确保属性面板显示最新数据
        setNode(updatedNode);
    }

    // 拖拽相关事件处理
    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: DragEvent) => {
        event.preventDefault();

        const nodeType = event.dataTransfer.getData('application/reactflow');
        
        if (typeof nodeType === 'undefined' || !nodeType) {
            return;
        }

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode: Node = {
            id: nanoid(8),
            type: nodeType,
            position,
            data: { 
                title: NodeTypes[nodeType].title,
                input: [],
                variables: []
            },
        };

        setNodes((nds) => nds.concat(newNode));
    }, [screenToFlowPosition, setNodes]);

    const nodeTypes = useMemo(() => {
        return Object.fromEntries(
            Object.entries(NodeTypes).map(([key, value]) => [key, value.node])
        );
    }, [NodeTypes])

    return (
        <Splitter style={{ height: '100%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Splitter.Panel defaultSize="155" min='5%' max="20%" collapsible={{ start: false, end: true, showCollapsibleIcon: 'auto' }}>
                <ComponentPanel onChange={onChange} />
            </Splitter.Panel>
            <Splitter.Panel>
                <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
                    <ReactFlow
                        proOptions={{hideAttribution: true}}
                        nodeTypes={nodeTypes}
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onSelectionChange={onSelectionChange}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        style={{ position: 'relative' }}
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
        <FlowPage />
    </ReactFlowProvider>
);