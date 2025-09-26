import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Connection,
    EdgeChange,
    Node,
    NodeChange,
    useReactFlow
} from "@xyflow/react";
import React, {type MouseEvent as ReactMouseEvent, useCallback, useState} from "react";
import {addNode, setEdges, setNodes, state, updateNode} from "@/states/flow";
import {NodeTypes} from "@/utils/constants";
import {useSnapshot} from "valtio";
import {getAllChildrenIds, getNodeAbsolutePosition} from "@/utils/flow";

export const useFlow = () => {
    const snap = useSnapshot(state);
    const {screenToFlowPosition, getIntersectingNodes} = useReactFlow();
    const [dropNodeIds, setDropNodeIds] = useState<string[] | null>(null);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes(applyNodeChanges(changes, state.nodes));
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        setEdges(applyEdgeChanges(changes, state.edges));
    }, []);

    const onConnect = useCallback((connection: Connection) => {
        setEdges(addEdge(connection, state.edges));
    }, []);

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
    }, [screenToFlowPosition]);

    const onNodeDrag = useCallback((event: any, draggedNode: Node) => {
        // 清除悬停状态，移除 node-hovered 样式
        setHoveredNodeId(null);
        
        // 获取拖拽节点的所有子节点ID
        const childrenIds = getAllChildrenIds(draggedNode.id, snap.nodes as readonly Node[]);
        const intersectingNodes = getIntersectingNodes(draggedNode).filter(node =>
            NodeTypes[node.type!]?.isParent === true &&
            node.id !== draggedNode.id &&
            !childrenIds.includes(node.id)
        );
        const newDropNodeIds = intersectingNodes.map(node => node.id);
        setDropNodeIds(newDropNodeIds);
    }, [getIntersectingNodes, dropNodeIds, snap.nodes]);

    const onNodeDragStop = useCallback((event: ReactMouseEvent, draggedNode: Node) => {
        console.log('onNodeDragStop', draggedNode)
        setDropNodeIds([]);
        // 获取拖拽节点的所有子节点ID
        const childrenIds = getAllChildrenIds(draggedNode.id, snap.nodes as readonly Node[]);
        const intersectingNodes = getIntersectingNodes(draggedNode).filter(node =>
            NodeTypes[node.type!]?.isParent === true &&
            node.id !== draggedNode.id &&
            !childrenIds.includes(node.id)
        );

        // 节点移出父节点
        if (intersectingNodes.length <= 0) {
            if (draggedNode.parentId) {
                // 使用新的函数计算绝对位置，支持多层嵌套
                let absolutePosition = getNodeAbsolutePosition(draggedNode.id, snap.nodes as readonly Node[]);
                updateNode({...draggedNode, parentId: undefined, position: absolutePosition})
            }
            return;
        }
        console.log('onNodeDragStop1', draggedNode, intersectingNodes)
        // 节点移入父节点
        let targetNode = intersectingNodes[intersectingNodes.length - 1];
        // 拖拽节点父节点为空
        if (!draggedNode.parentId) {
            let relativePosition = {
                x: draggedNode.position.x - targetNode.position.x,
                y: draggedNode.position.y - targetNode.position.y
            };
            updateNode({...draggedNode, parentId: targetNode.id, position: relativePosition})
            return;
        }
        console.log('onNodeDragStop2', draggedNode)
        // 在同一个父节点内拖动，不处理
        if (draggedNode.parentId === targetNode.id) {
            return;
        }
        // 节点移入其他父节点
        // 使用新的函数计算当前节点的绝对位置，支持多层嵌套
        let absolutePosition = getNodeAbsolutePosition(draggedNode.id, snap.nodes as readonly Node[]);
        // 计算目标父节点的绝对位置
        let targetAbsolutePosition = getNodeAbsolutePosition(targetNode.id, snap.nodes as readonly Node[]);
        let relativePosition = {
            x: absolutePosition.x - targetAbsolutePosition.x,
            y: absolutePosition.y - targetAbsolutePosition.y
        };
        updateNode({...draggedNode, parentId: targetNode.id, position: relativePosition})
        console.log('onNodeDragStop3', draggedNode)
    }, [snap.nodes]);

    const onNodeMouseEnter = useCallback((event: ReactMouseEvent, node: Node) => {
        setHoveredNodeId(node.id);
    }, []);

    const onNodeMouseLeave = useCallback((event: ReactMouseEvent, node: Node) => {
        setHoveredNodeId(null);
    }, []);


    return {
        dropNodeIds,
        hoveredNodeId,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onDrop,
        onDragOver,
        onNodeDrag,
        onNodeDragStop,
        onNodeMouseEnter,
        onNodeMouseLeave,
    }
}