import { proxy } from 'valtio';
import { NODE_TYPE, NodeDefineTypes } from '@/pages/flow/nodeTypes';
import { getAllChildrenIds, sortNodes } from '@/pages/flow/util';
import { message } from 'antd/lib';
import { EdgeType, NodeType } from '@/types/flow/nodes';
import { newId } from '@/utils/id';
import { getFlow } from '@/api/flow';

interface NodeSize {
  id: string;
  width: number;
  height: number;
}

const NodeSizeMap: Record<string, NodeSize> = {};

// 工作流编辑相关状态
export const editFlowState = proxy({
  nodes: [] as NodeType<any>[],
  edges: [] as EdgeType<any>[],
  selectedNode: null as NodeType<any> | null,
  hoveredNodeId: null as string | null,
});

// ==================== 工作流编辑相关函数 ====================

export const fetchFlow = async (id: string) => {
  const flow = await getFlow(id);
  editFlowState.nodes = flow.data?.nodes || [];
  editFlowState.edges = flow.data?.edges || [];
};

export const saveFlow = () => {
  // 根据 NodeSizeMap 更新 nodes 的尺寸
  const updatedNodes = editFlowState.nodes.map((node) => {
    const savedSize = NodeSizeMap[node.id];
    if (savedSize) {
      return {
        ...node,
        width: savedSize.width,
        height: savedSize.height,
      };
    }
    return node;
  });

  const flowData = {
    nodes: updatedNodes,
    edges: editFlowState.edges,
  };
  console.log(JSON.stringify(flowData));
};

export const setSelectedNode = (node: NodeType<any> | null) => {
  editFlowState.selectedNode = node;
};

export const setHoveredNodeId = (nodeId: string | null) => {
  editFlowState.hoveredNodeId = nodeId;
};

export const addNode = (type: string, position: { x: number; y: number }) => {
  let startNode = editFlowState.nodes.find((n) => n.type === NODE_TYPE.START);
  if (type === NODE_TYPE.START && startNode) {
    message.info('流程中只能有一个开始节点！');
    return;
  }
  createNode(type, position);
};

export const updateNode = (node: NodeType<any>) => {
  let nodes = editFlowState.nodes.map((n) => (n.id === node.id ? node : n));
  editFlowState.nodes = sortNodes(nodes);
};

export const deleteNode = (nodeId: string) => {
  let childrenNodes = getAllChildrenIds(nodeId, editFlowState.nodes);
  let nodes = editFlowState.nodes.filter((n) => n.id !== nodeId && !childrenNodes.includes(n.id));
  let edges = editFlowState.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
  editFlowState.nodes = nodes;
  editFlowState.edges = edges;

  // 如果被删除的节点是当前选中的节点，清除选中状态
  if (editFlowState.selectedNode && editFlowState.selectedNode.id === nodeId) {
    editFlowState.selectedNode = null;
  }
};

export const cloneNode = (nodeId: string) => {
  // 找到要克隆的节点
  const sourceNode = editFlowState.nodes.find((n) => n.id === nodeId);
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
  const clonedNode: NodeType<any> = {
    ...sourceNode,
    id: newId(),
    data: clonedData,
    zIndex: sourceNode.zIndex! + 1,
    selected: false,
    position: {
      x: sourceNode.position!.x + 50, // 向右偏移50px
      y: sourceNode.position!.y + 50, // 向下偏移50px
    },
  };

  // 添加克隆节点到状态中
  editFlowState.nodes = editFlowState.nodes.concat(clonedNode);
};

export const setNodes = (nodes: NodeType<any>[]) => {
  editFlowState.nodes = nodes;
};

export const setEdges = (edges: EdgeType<any>[]) => {
  editFlowState.edges = edges;
};

export const extendNode = (nodeId: string) => {
  let currentNode = editFlowState.nodes.find((n) => n.id === nodeId);
  if (!currentNode) {
    console.warn(`Node with id ${nodeId} not found`);
    return;
  }

  let childrenNodeIds = getAllChildrenIds(nodeId, editFlowState.nodes);

  // 获取当前展开状态，默认为true（展开）
  const currentExpanded = currentNode.data?.expanded !== false;
  const newExpanded = !currentExpanded;

  // 获取节点类型配置
  const nodeConfig = NodeDefineTypes[currentNode.type!];

  // 更新当前节点的展开状态和尺寸
  const updatedNode = {
    ...currentNode,
    data: {
      ...currentNode.data,
      expanded: newExpanded,
    },
  };

  // 如果是容器节点，处理尺寸变化
  if (nodeConfig?.defaultConfig?.data.group) {
    if (newExpanded) {
      // 展开：从 map 中恢复尺寸，如果没有则使用默认尺寸
      const savedSize = NodeSizeMap[nodeId];
      if (savedSize) {
        updatedNode.width = savedSize.width;
        updatedNode.height = savedSize.height;
      } else {
        updatedNode.width = nodeConfig.defaultConfig?.width || currentNode.width;
        updatedNode.height = nodeConfig.defaultConfig?.height || currentNode.height;
      }
    } else {
      // 收起：先记录当前尺寸到 map 中，再缩小尺寸
      NodeSizeMap[nodeId] = {
        id: nodeId,
        width: currentNode.width || nodeConfig.defaultConfig?.width || 220,
        height: currentNode.height || nodeConfig.defaultConfig?.height || 100,
      };

      // 缩小尺寸，只显示标题栏
      updatedNode.width = Math.min(currentNode.width || 220, 220);
      updatedNode.height = 40; // 只保留标题栏高度
    }
  }

  // 更新所有子节点的隐藏状态
  editFlowState.nodes = editFlowState.nodes.map((node) => {
    if (node.id === nodeId) {
      return updatedNode;
    }

    // 处理子节点的显示/隐藏
    if (childrenNodeIds.includes(node.id)) {
      return {
        ...node,
        hidden: !newExpanded, // 收起时隐藏子节点，展开时显示子节点
      };
    }

    return node;
  });
};

const createNode = (type: string, position: { x: number; y: number }) => {
  let node = NodeDefineTypes[type];
  let id = newId();
  let nodes: NodeType<any>[] = [];
  const newNode: NodeType<any> = {
    id,
    type,
    position,
    width: node.defaultConfig?.width,
    height: node.defaultConfig?.height,
    data: { ...node.defaultConfig?.data },
  };
  nodes.push(newNode);

  if (type === NODE_TYPE.LOOP) {
    let forStartNodeCfg = NodeDefineTypes[NODE_TYPE.GROUP_START];
    const forStartNode = {
      ...forStartNodeCfg.defaultConfig,
      type: NODE_TYPE.GROUP_START,
      position: forStartNodeCfg.defaultConfig?.position!,
      data: { ...forStartNodeCfg.defaultConfig?.data },
      id: newId(),
      parentId: id,
    };
    nodes.push(forStartNode);
  }

  editFlowState.nodes.push(...nodes);
};
