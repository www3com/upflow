import {
    Node,
    Edge,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    NodeChange,
    EdgeChange,
    Connection
} from '@xyflow/react';
import {proxy} from "valtio";

export const flowState = proxy({
    nodes: [] as Node[],
    edges: [] as Edge[],
});

export const flowActions = {
    onNodesChange: (changes: NodeChange[]) => {
        flowState.nodes = applyNodeChanges(changes, flowState.nodes);
    },
    onEdgesChange: (changes: EdgeChange[]) => {
        flowState.edges = applyEdgeChanges(changes, flowState.edges);
    },
    onConnect: (connection: Connection) => {
        flowState.edges = addEdge(connection, flowState.edges);
    },
};
