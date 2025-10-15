import {Node, Edge} from '@xyflow/react';
import {Variable} from '@/typings';
import {NODE_TYPE, NodeDefineTypes} from '../pages/flow/nodeTypes';

/**
 * 递归获取指定节点的所有前置节点对象
 * @param nodeId 目标节点ID
 * @param edges 边数组
 * @param nodes 节点数组
 * @param visited 已访问的节点集合，用于避免循环引用
 * @returns 前置节点对象数组
 */
const getPreviousNodes = (nodeId: string, edges: Edge[], nodes: Node[], visited: Set<string> = new Set()): Node[] => {
    if (visited.has(nodeId)) {
        return [];
    }

    visited.add(nodeId);
    const previousNodes: Node[] = [];

    // 查找所有指向当前节点的边
    const incomingEdges = edges.filter(edge => edge.target === nodeId);

    for (const edge of incomingEdges) {
        const sourceNodeId = edge.source;
        const sourceNode = nodes.find(n => n.id === sourceNodeId);

        if (sourceNode) {
            previousNodes.push(sourceNode);

            // 递归获取前置节点的前置节点
            const nestedPreviousNodes = getPreviousNodes(sourceNodeId, edges, nodes, new Set(visited));
            previousNodes.push(...nestedPreviousNodes);
        }
    }

    return previousNodes;
};

export interface VariableWithNode {
    nodeId: string;
    nodeName: string;
    varName: string;
    varType: string;
    nodeIcon: string;
}

/**
 * 获取当前节点可用的变量列表（包含节点信息）
 * @param currentNodeId 当前节点ID
 * @param nodes 流程中的所有节点
 * @param edges 流程中的所有边
 * @returns 包含节点信息的变量列表
 */
export const getAvailableVariablesWithNode = (currentNodeId: string, nodes: Node[], edges: Edge[]): VariableWithNode[] => {
    const variablesWithNode: VariableWithNode[] = [];

    // 获取当前节点的所有前置节点对象
    const previousNodes = getPreviousNodes(currentNodeId, edges, nodes);

    // 遍历前置节点，收集变量
    previousNodes.forEach(node => {
        const nodeName = (node.data.title as string) || `节点${node.id}`;
        const variables: Variable[] = [];

        // 从开始节点获取输入变量
        if (node.type === NODE_TYPE.START) {
            const inputVariables = (node.data.variables || []) as Variable[];
            variables.push(...inputVariables);
        }

        // 从其他节点获取输出变量（如果有的话）
        if (node.data.output) {
            variables.push(node.data.output as Variable);
        }

        // 将变量转换为包含节点信息的格式
        variables.forEach(variable => {
            const nodeIcon = NodeDefineTypes[node.type!]?.icon || 'icon-default';
            variablesWithNode.push({
                nodeId: node.id,
                nodeName,
                varName: variable.name,
                varType: variable.type,
                nodeIcon
            });
        });
    });

    return variablesWithNode;
};