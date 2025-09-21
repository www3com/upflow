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
import {Button, Space, Splitter} from "antd";
import AttributePanel from "@/pages/flow/components/AttributePanel";
import {nanoid} from 'nanoid';
import {getFlowApi} from "@/services/flow";
import {NodeTypes} from "@/utils/constants";
import ComponentPanel from "@/pages/flow/components/ComponentPanel";

const FlowPage = () => {
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<Node>();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const {screenToFlowPosition} = useReactFlow();

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

    const { getIntersectingNodes } = useReactFlow();
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);


    
    // 节点拖拽开始事件处理
    const onNodeDragStart = useCallback((event: any, node: Node) => {
        setDraggedNodeId(node.id);
        setIsDragging(true);
        isDraggingRef.current = true;
    }, []);

    // 点击空白区域取消选中
    const onPaneClick = useCallback(() => {
        if (isDraggingRef.current) {
            return;
        }
        setOpen(false);
    }, []);
    
    // 节点拖拽过程中事件处理
    const onNodeDrag = useCallback((event: any, draggedNode: Node) => {
        // 实时检测重叠的循环节点
        const intersectingNodes = getIntersectingNodes(draggedNode).filter(node => 
            node.type === 'for' && node.id !== draggedNode.id
        );
        
        const newDropTarget = intersectingNodes.length > 0 ? intersectingNodes[0].id : null;
        if (newDropTarget !== dropTarget) {
            setDropTarget(newDropTarget);
        }
    }, [getIntersectingNodes, dropTarget]);
    
    // 节点拖拽结束事件处理
    const onNodeDragStop = useCallback((event: any, draggedNode: Node) => {
        // 使用ReactFlow的getIntersectingNodes方法查找重叠的节点
        const intersectingNodes = getIntersectingNodes(draggedNode).filter(node => 
            node.type === 'for' && node.id !== draggedNode.id // 只检查循环节点，排除自己
        );

        // 如果找到重叠的循环节点，设置父子关系
        if (intersectingNodes.length > 0) {
            const targetNode = intersectingNodes[0]; // 取第一个重叠的循环节点
            
            setNodes((nds) => nds.map((n) => {
                if (n.id === draggedNode.id) {
                    // 如果节点已经是这个父节点的子节点，保持当前的相对位置
                    if (n.parentId === targetNode.id) {
                        // 对于已经是子节点的情况，draggedNode.position已经是相对坐标
                        return {
                            ...n,
                            position: draggedNode.position
                        };
                    }
                    
                    // 新建父子关系时，需要将绝对坐标转换为相对坐标
                    let relativePosition;
                    if (n.parentId) {
                        // 如果节点原来有其他父节点，先转换为绝对坐标
                        const oldParent = nds.find(p => p.id === n.parentId);
                        if (oldParent) {
                            const absolutePos = {
                                x: oldParent.position.x + n.position.x,
                                y: oldParent.position.y + n.position.y
                            };
                            relativePosition = {
                                x: absolutePos.x - targetNode.position.x,
                                y: absolutePos.y - targetNode.position.y
                            };
                        } else {
                            relativePosition = {
                                x: draggedNode.position.x - targetNode.position.x,
                                y: draggedNode.position.y - targetNode.position.y
                            };
                        }
                    } else {
                        // 节点原来没有父节点，draggedNode.position是绝对坐标
                        relativePosition = {
                            x: draggedNode.position.x - targetNode.position.x,
                            y: draggedNode.position.y - targetNode.position.y
                        };
                    }
                    
                    return {
                        ...n,
                        parentId: targetNode.id,
                        position: relativePosition,
                        extent: 'parent'
                    };
                }
                return n;
            }));
            
            console.log(`节点 ${draggedNode.id} 已设置父节点为循环节点 ${targetNode.id}`);
        }
        
        // 清理拖拽状态
        setDraggedNodeId(null);
        setDropTarget(null);
        setIsDragging(false);
        isDraggingRef.current = false;
    }, [getIntersectingNodes, setNodes]);

    // 节点点击事件处理 - 拖拽期间阻止点击选中，正常情况下处理选中逻辑
    const onNodeClick = useCallback((event: any, node: Node) => {
        if (isDraggingRef.current) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        
        // 处理节点选中逻辑
        setOpen(true);
        setNode(node);
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
            data: {...NodeTypes[nodeType].data},
        };

        setNodes((nds) => nds.concat(newNode));
    }, [screenToFlowPosition, setNodes]);

    const nodeTypes = useMemo(() => {
        return Object.fromEntries(
            Object.entries(NodeTypes).map(([key, value]) => [key, value.node])
        );
    }, [NodeTypes])

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
                        edges={edges}
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