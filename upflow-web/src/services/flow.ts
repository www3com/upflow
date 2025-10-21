import request from "@/utils/request";
import {EdgeType, NodeType} from "@/types/flow";


export interface FlowType {
    nodes: NodeType<any>[];
    edges: EdgeType<any>[];
    viewport: {
        x: number;
        y: number;
        zoom: number;
    };
}

export async function getFlowApi(): Promise<R<FlowType>> {
        return request.get('/flow')
}