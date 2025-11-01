import { EdgeType, NodeType } from '@/types/flow/nodes';

export interface Flow {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  updatedTime: string;
}

export interface FlowDetail extends Flow {
  nodes: NodeType<any>[];
  edges: EdgeType<any>[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface CreateFlowReq {
  name: string;
  description?: string;
}

export interface UpdateFlowReq extends CreateFlowReq {
  id: string;
}

export interface UpdateFlowTagReq {
  flowId: string;
  tags: string[];
}

// 工作流目录树节点
export interface FlowFolder {
  id: string;
  name: string;
  children?: FlowFolder[];
}
