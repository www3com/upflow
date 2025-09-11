import request from "@/utils/request";
import { Node,Edge } from '@xyflow/react';


export interface FlowType {
    nodes: Node[];
    edges: Edge[];
    viewport: {
        x: number;
        y: number;
        zoom: number;
    };
}



export function getFlow(): Promise<R<FlowType>> {
        return request.get('/flow')
}