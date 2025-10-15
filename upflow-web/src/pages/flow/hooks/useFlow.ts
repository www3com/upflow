import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Connection, Edge,
    EdgeChange, getOutgoers,
    Node,
    NodeChange,
    useReactFlow
} from "@xyflow/react";
import React, {type MouseEvent as ReactMouseEvent, useCallback, useState} from "react";
import {addNode, setEdges, setNodes, setSelectedNode, setHoveredNodeId, state, updateNode} from "@/states/flow";
import {NodeDefineTypes} from "@/pages/flow/nodeTypes";
import {useSnapshot} from "valtio";
import {getAllChildrenIds, getNodeAbsolutePosition} from "@/pages/flow/util";
import {NodeType} from "@/typings";

export const useFlow = () => {
    const snap = useSnapshot(state);
    const {screenToFlowPosition, getIntersectingNodes} = useReactFlow();
    const [dropNodeIds, setDropNodeIds] = useState<string[] | null>(null);

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        // 检测选择状态变化
        const selectChanges = changes.filter(change => change.type === 'select');

        if (selectChanges.length > 0) {
            // 找到被选中的节点
            const selectedChange = selectChanges.find(change => change.selected === true);

            if (selectedChange) {
                // 找到对应的节点并更新 selectedNode
                const selectedNode = state.nodes.find(node => node.id === selectedChange.id);
                if (selectedNode) {
                    setSelectedNode(selectedNode as NodeType);
                }
            } else {
                // 如果没有节点被选中，清空 selectedNode
                setSelectedNode(null);
            }
        }

        // 检测删除节点变化
        const removeChanges = changes.filter(change => change.type === 'remove');
        if (removeChanges.length > 0 && state.selectedNode) {
            // 检查当前选中的节点是否被删除
            const isSelectedNodeRemoved = removeChanges.some(change => change.id === state.selectedNode?.id);
            if (isSelectedNodeRemoved) {
                setSelectedNode(null);
            }
        }

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
            NodeDefineTypes[node.type!]?.defaultConfig?.data.group === true &&
            node.id !== draggedNode.id &&
            !childrenIds.includes(node.id)
        );
        const newDropNodeIds = intersectingNodes.map(node => node.id);
        setDropNodeIds(newDropNodeIds);
    }, [getIntersectingNodes, snap.nodes]);

    const onNodeDragStop = useCallback((event: ReactMouseEvent, draggedNode: Node) => {
        console.log('onNodeDragStop', draggedNode)
        setDropNodeIds([]);
        // 获取拖拽节点的所有子节点ID
        const childrenIds = getAllChildrenIds(draggedNode.id, snap.nodes as readonly Node[]);
        const intersectingNodes = getIntersectingNodes(draggedNode).filter(node =>
            NodeDefineTypes[node.type!]?.defaultConfig?.data.group === true &&
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

    const onValidConnection = useCallback((connection: Edge | Connection) => {
        const target = snap.nodes.find((node) => node.id === connection.target);
        if (!target) return false;
        const hasCycle = (node: Node, visited = new Set()) => {
            if (visited.has(node.id)) return false;

            visited.add(node.id);

            for (const outgoer of getOutgoers(node, snap.nodes as Node[], snap.edges as Edge[])) {
                if (outgoer.id === connection.source) return true;
                if (hasCycle(outgoer, visited)) return true;
            }
        };

        if (target.id === connection.source) return false;
        return !hasCycle(target as Node);
    }, [snap.nodes, snap.edges])

    return {
        hoveredNodeId: snap.hoveredNodeId,
        setHoveredNodeId,
        dropNodeIds,
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
    }
}