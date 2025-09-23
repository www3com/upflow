import {useCallback, useEffect, useRef, useState, DragEvent, useMemo} from 'react';
import {Node, Edge, useReactFlow} from '@xyflow/react';
import {nanoid} from 'nanoid';
import {getFlowApi} from "@/services/flow";
import {NodeTypes} from "@/utils/constants";
import {sortNodesByParentChild} from "@/utils/flow";
import {useSnapshot} from "valtio";
import {flowActions, flowState} from "@/states/flow";

export const useFlow = () => {
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<Node>();
    const {nodes, edges} = useSnapshot(flowState);
    const {onNodesChange, onEdgesChange, onConnect} = flowActions;
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const {screenToFlowPosition, getIntersectingNodes} = useReactFlow();

    const [dropTarget, setDropTarget] = useState<string | null>(null);
    const isDraggingRef = useRef(false);

    const init = async () => {
        const res = await getFlowApi();
        const sortedNodes = sortNodesByParentChild(res.data!.nodes);
        flowState.nodes = sortedNodes;
        flowState.edges = res.data!.edges;
    };

    useEffect(() => {
        init();
    }, []);

    const onNodeDragStart = useCallback((event: any, node: Node) => {
        isDraggingRef.current = true;
    }, []);

    const onPaneClick = useCallback(() => {
        if (isDraggingRef.current) {
            return;
        }
        setOpen(false);
    }, []);

    const onNodeDrag = useCallback((event: any, draggedNode: Node) => {
        const intersectingNodes = getIntersectingNodes(draggedNode).filter(node =>
            NodeTypes[node.type!].isParent && node.id !== draggedNode.id
        );
        const newDropTarget = intersectingNodes.length > 0 ? intersectingNodes[0].id : null;
        if (newDropTarget !== dropTarget) {
            setDropTarget(newDropTarget);
        }
    }, [getIntersectingNodes, dropTarget]);

    const onNodeDragStop = useCallback((event: any, draggedNode: Node) => {
        const intersectingNodes = getIntersectingNodes(draggedNode).filter(node =>
            NodeTypes[node.type!].isParent && node.id !== draggedNode.id
        );

        if (intersectingNodes.length > 0) {
            const targetNode = intersectingNodes[0];
            const updatedNodes = flowState.nodes.map((n) => {
                if (n.id === draggedNode.id) {
                    if (n.parentId === targetNode.id) {
                        return {
                            ...n,
                            position: draggedNode.position
                        };
                    }
                    let relativePosition;
                    if (n.parentId) {
                        const oldParent = flowState.nodes.find(p => p.id === n.parentId);
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
                        relativePosition = {
                            x: draggedNode.position.x - targetNode.position.x,
                            y: draggedNode.position.y - targetNode.position.y
                        };
                    }
                    return {
                        ...n,
                        parentId: targetNode.id,
                        position: relativePosition,
                        extent: 'parent' as const
                    };
                }
                return n;
            });
            flowState.nodes = sortNodesByParentChild(updatedNodes);
            console.log(`节点 ${draggedNode.id} 已设置父节点为循环节点 ${targetNode.id}`);
        }

        setDropTarget(null);
        isDraggingRef.current = false;
    }, [getIntersectingNodes,  setDropTarget]);

    const onNodeClick = useCallback((event: any, node: Node) => {
        if (isDraggingRef.current) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        setOpen(true);
        setNode(node);
    }, [isDraggingRef, setOpen, setNode]);

    const onSave = useCallback(() => {
        const flowData = {nodes, edges};
        console.log(JSON.stringify(flowData));
    }, [nodes, edges]);

    const onChange = (updatedNode: Node) => {
        flowState.nodes = flowState.nodes.map((n) => n.id === updatedNode.id ? updatedNode : n);
        setNode(updatedNode);
    };

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
        let node = NodeTypes[nodeType];
        const newNode: Node = {
            id: nanoid(8),
            type: nodeType,
            width: node.width,
            height: node.height,
            position,
            data: {...node.data},
        };
        flowState.nodes = sortNodesByParentChild(flowState.nodes.concat(newNode));
    }, [screenToFlowPosition]);

    const nodeTypes = useMemo(() => {
        return Object.fromEntries(
            Object.entries(NodeTypes).map(([key, value]) => [key, value.node])
        );
    }, []);

    return {
        open,
        node,
        nodes: flowState.nodes as Node[],
        edges,
        reactFlowWrapper,
        onNodesChange,
        onEdgesChange,
        onConnect,
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
    };
};