import {Node, Edge} from '@xyflow/react';
import {proxy} from "valtio";
import {nanoid} from "nanoid";
import {getFlowApi} from "@/services/flow";
import {NodeTypes} from "@/utils/constants";
import {sortNodes} from "@/utils/flow";
import {message} from "antd/lib";

export const state = proxy({
    nodes: [] as Node[],
    edges: [] as Edge[],
});

export const init = async () => {
    const res = await getFlowApi();
    state.nodes = res.data!.nodes;
    state.edges = res.data!.edges;
}

export const saveFlow = () => {
    const flowData = {nodes: state.nodes, edges: state.edges};
    console.log(JSON.stringify(flowData));
}

export const addNode = (type: string, position: { x: number, y: number }) => {
    let startNode = state.nodes.find(n => n.type === 'start');
    if (type === 'start' && startNode) {
        message.info('流程中只能有一个开始节点！');
        return;
    }

    let node = NodeTypes[type];
    const newNode: Node = {
        id: nanoid(8),
        type: type,
        width: node.width,
        height: node.height,
        data: {...node.data},
        extent: 'parent',
        position,
    };
    state.nodes = state.nodes.concat(newNode);
}
export const updateNode = (node: Node) => {
    let nodes = state.nodes.map(n => n.id === node.id ? node : n);
    state.nodes = sortNodes(nodes)
}

export const deleteNode = (nodeId: string) => {
    let nodes = state.nodes.filter(n => n.id !== nodeId);
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


