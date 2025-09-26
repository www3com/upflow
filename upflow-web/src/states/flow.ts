import {
    Node,
    Edge, applyNodeChanges, NodeChange, EdgeChange, applyEdgeChanges, Connection, addEdge
} from '@xyflow/react';
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
    console.log('state', startNode, type)
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

export const setNodes = (nodes: Node[]) => {
    state.nodes = nodes;
}

export const changeNodes = (changes: NodeChange[]) => {
    state.nodes = applyNodeChanges(changes, state.nodes);
}

export const changeEdges = (changes: EdgeChange[]) => {
    state.edges = applyEdgeChanges(changes, state.edges);
}

export const changeConnect = (connection: Connection) => {
    state.edges = addEdge(connection, state.edges);
}
