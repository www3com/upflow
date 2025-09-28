import {Node, Edge} from '@xyflow/react';
import {proxy} from "valtio";
import {nanoid} from "nanoid";
import {getFlowApi} from "@/services/flow";
import {NODE_TYPE, NodeTypes} from "@/utils/constants";
import {getAllChildrenIds, newId, sortNodes} from "@/utils/flow";
import {message} from "antd/lib";
import {NodeType} from "@/typings";

interface NodeSize {
    id: string;
    width: number,
    height: number
}

const NodeSizeMap: Record<string, NodeSize> = {};

export const state = proxy({
    nodes: [] as Node[],
    edges: [] as Edge[],
    selectedNode: null as NodeType | null,
});


export const init = async () => {
    const res = await getFlowApi();
    state.nodes = res.data!.nodes;
    state.edges = res.data!.edges;
}

export const setSelectedNode = (node: NodeType | null) => {
    state.selectedNode = node;
}

export const saveFlow = () => {
    // 根据 NodeSizeMap 更新 nodes 的尺寸
    const updatedNodes = state.nodes.map(node => {
        const savedSize = NodeSizeMap[node.id];
        if (savedSize) {
            return {
                ...node,
                width: savedSize.width,
                height: savedSize.height
            };
        }
        return node;
    });

    const flowData = {
        nodes: updatedNodes,
        edges: state.edges,
    };
    console.log(JSON.stringify(flowData));
}

export const addNode = (type: string, position: { x: number, y: number }) => {
    let startNode = state.nodes.find(n => n.type === NODE_TYPE.START);
    if (type === NODE_TYPE.START && startNode) {
        message.info('流程中只能有一个开始节点！');
        return;
    }
    createNode(type, position);
}
export const updateNode = (node: Node) => {
    let nodes = state.nodes.map(n => n.id === node.id ? node : n);
    state.nodes = sortNodes(nodes)
}

export const deleteNode = (nodeId: string) => {
    let childrenNodes = getAllChildrenIds(nodeId, state.nodes);
    let nodes = state.nodes.filter(n => n.id !== nodeId && !childrenNodes.includes(n.id));
    let edges = state.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    state.nodes = nodes;
    state.edges = edges;
}

export const cloneNode = (nodeId: string) => {
    // 找到要克隆的节点
    const sourceNode = state.nodes.find(n => n.id === nodeId);
    if (!sourceNode) {
        message.error('未找到要克隆的节点！');
        return;
    }

    // 检查是否为开始节点，开始节点不能克隆
    if (sourceNode.type === 'start') {
        message.info('开始节点不能被克隆！');
        return;
    }

    // 深拷贝节点数据
    const clonedData = JSON.parse(JSON.stringify(sourceNode.data));

    // 创建克隆节点，位置稍微偏移避免重叠
    const clonedNode: Node = {
        ...sourceNode,
        id: nanoid(8),
        data: clonedData,
        zIndex: sourceNode.zIndex! + 1,
        selected: false,
        position: {
            x: sourceNode.position.x + 50, // 向右偏移50px
            y: sourceNode.position.y + 50  // 向下偏移50px
        }
    };

    // 添加克隆节点到状态中
    state.nodes = state.nodes.concat(clonedNode);
}

export const setNodes = (nodes: Node[]) => {
    state.nodes = nodes;
}

export const setEdges = (edges: Edge[]) => {
    state.edges = edges;
}

export const extendNode = (nodeId: string) => {
    let currentNode = state.nodes.find(n => n.id === nodeId);
    if (!currentNode) {
        console.warn(`Node with id ${nodeId} not found`);
        return;
    }

    let childrenNodeIds = getAllChildrenIds(nodeId, state.nodes);

    // 获取当前展开状态，默认为true（展开）
    const currentExpanded = currentNode.data?.expanded !== false;
    const newExpanded = !currentExpanded;

    // 获取节点类型配置
    const nodeConfig = NodeTypes[currentNode.type!];

    // 更新当前节点的展开状态和尺寸
    const updatedNode = {
        ...currentNode,
        data: {
            ...currentNode.data,
            expanded: newExpanded
        }
    };


    // 如果是容器节点，处理尺寸变化
    if (nodeConfig?.data.group) {
        if (newExpanded) {
            // 展开：从 map 中恢复尺寸，如果没有则使用默认尺寸
            const savedSize = NodeSizeMap[nodeId];
            if (savedSize) {
                updatedNode.width = savedSize.width;
                updatedNode.height = savedSize.height;
            } else {
                updatedNode.width = nodeConfig.width || currentNode.width;
                updatedNode.height = nodeConfig.height || currentNode.height;
            }
        } else {

            // 收起：先记录当前尺寸到 map 中，再缩小尺寸
            NodeSizeMap[nodeId] = {
                id: nodeId,
                width: currentNode.width || nodeConfig.width || 220,
                height: currentNode.height || nodeConfig.height || 100
            };

            // 缩小尺寸，只显示标题栏
            updatedNode.width = Math.min(currentNode.width || 220, 220);
            updatedNode.height = 40; // 只保留标题栏高度
        }
    }

    // 更新所有子节点的隐藏状态
    const updatedNodes = state.nodes.map(node => {
        if (node.id === nodeId) {
            return updatedNode;
        }

        // 处理子节点的显示/隐藏
        if (childrenNodeIds.includes(node.id)) {
            return {
                ...node,
                hidden: !newExpanded // 收起时隐藏子节点，展开时显示子节点
            };
        }

        return node;
    });

    // 更新状态
    state.nodes = updatedNodes;
}

const createNode = (type: string, position: { x: number, y: number }) => {
    let node = NodeTypes[type];
    let id = newId();
    let nodes: Node[] = [];
    const newNode: Node = {
        id, type, position,
        width: node.width,
        height: node.height,
        data: {...node.data},
        extent: 'parent',
    };
    nodes.push(newNode);

    if (type === NODE_TYPE.FOR) {
        let forStartNodeCfg = NodeTypes[NODE_TYPE.FOR_START];
        const forStartNode = {
            ...forStartNodeCfg,
            type: NODE_TYPE.FOR_START,
            position: forStartNodeCfg.position!,
            data: {...forStartNodeCfg.data},
            id: newId(),
            parentId: id
        };
        nodes.push(forStartNode);
    }

    state.nodes.push(...nodes);
}
