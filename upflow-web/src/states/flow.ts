import {
    Node,
    Edge, applyNodeChanges, NodeChange, EdgeChange, applyEdgeChanges, Connection, addEdge
} from '@xyflow/react';
import {proxy} from "valtio";
import {nanoid} from "nanoid";
import {useCallback} from "react";
import {getFlowApi} from "@/services/flow";

export const state = proxy({
    nodes: [] as Node[],
    edges: [] as Edge[],
});

export const init = async () => {
    const res = await getFlowApi();
    state.nodes = res.data!.nodes;
    state.edges = res.data!.edges;
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
