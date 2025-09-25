import {
    Node,
    Edge, applyNodeChanges, NodeChange, EdgeChange, applyEdgeChanges, Connection, addEdge
} from '@xyflow/react';
import {proxy} from "valtio";
import {nanoid} from "nanoid";
import {getFlowApi} from "@/services/flow";
import {NodeTypes} from "@/utils/constants";

export const state = proxy({
    nodes: [] as Node[],
    edges: [] as Edge[],
});

export const init = async () => {
    const res = await getFlowApi();
    state.nodes = res.data!.nodes;
    state.edges = res.data!.edges;
}

export const addNode = (type: string, position: { x: number, y: number }) => {
    let node = NodeTypes[type];
    const newNode: Node = {
        id: nanoid(8),
        type: type,
        width: node.width,
        height: node.height,
        position,
        data: {...node.data},
    };
    state.nodes = state.nodes.concat(newNode);
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
