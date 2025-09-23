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
import {nanoid} from "nanoid";

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
    deleteNode: (nodeId: string) => {
        flowState.nodes = flowState.nodes.filter(n => n.id !== nodeId);
        flowState.edges = flowState.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    },
    copyNode: (nodeId: string) => {
        const nodeToCopy = flowState.nodes.find(n => n.id === nodeId);
        console.log('copy node', nodeToCopy);
        if (nodeToCopy) {
            const newNode = {
                ...nodeToCopy,
                id: `${nanoid(8)}`,
                position: {
                    x: nodeToCopy.position.x + 200,
                    y: nodeToCopy.position.y + 200,
                },
                selected: false,
            };
            flowState.nodes.push(newNode);
        }
    }
};
