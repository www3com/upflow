import {Edge, Node} from '@xyflow/react';
import {NodeDefineTypes} from '@/pages/flow/nodeTypes';
import {VARIABLE_TYPES, VariableTypeNode, VALIDATION_RULE_TYPES, VARIABLE_TYPE_RULES_MAP, VALIDATION_RULE_DEFAULT_MESSAGES} from '@/utils/constants';
import {Variable, VariableType} from "@/typings";

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
    nodeName: string;
    nodeIcon: string;
    varId: string;
    varName: string;
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
        if (node.data.input) {
            const inputVariables = (node.data.input || []) as Variable[];
            variables.push(...inputVariables);
        }

        // 从其他节点获取输出变量（如果有的话）
        if (node.data.output) {
            const outputVariables = (node.data.output || []) as Variable[];
            variables.push(...outputVariables);
        }

        // 将变量转换为包含节点信息的格式
        variables.forEach(variable => {
            const nodeIcon = NodeDefineTypes[node.type!]?.icon || 'icon-default';
            variablesWithNode.push({
                nodeName,
                nodeIcon,
                varId: variable.id,
                varName: variable.name
            });
        });
    });

    return variablesWithNode;
};


const findVariableTypeLabel = (type: VariableType): string => {
    const findInNodes = (nodes: VariableTypeNode[]): string | null => {
        for (const node of nodes) {
            if (node.value === type) return node.label;
            if (node.children) {
                const found = findInNodes(node.children);
                if (found) return found;
            }
        }
        return null;
    };

    return findInNodes(VARIABLE_TYPES) || type;
};

export const getVariableTypeLabel = (value: VariableType): string => {
    const parts = value.split('_');
    if (parts.length === 1) {
        return findVariableTypeLabel(value);
    }

    const [outerType, ...innerParts] = parts;
    const outerLabel = findVariableTypeLabel(outerType as VariableType);
    const innerType = innerParts.join('_') as VariableType;
    const innerLabel = getVariableTypeLabel(innerType);

    return `${outerLabel}<${innerLabel}>`;
};

export const getAvailableRules = (variableType: string) => {
  const availableRuleTypes = VARIABLE_TYPE_RULES_MAP[variableType as keyof typeof VARIABLE_TYPE_RULES_MAP] || [];
  return VALIDATION_RULE_TYPES.filter((rule: any) => availableRuleTypes.includes(rule.value));
};

export const getDefaultErrorMessage = (ruleType: string, value?: string): string => {
    const template = VALIDATION_RULE_DEFAULT_MESSAGES[ruleType];
    if (!template) return "";
    
    // 对于需要参数的规则类型，如果没有提供值则返回基础模板
    if (!value) return template;
    
    // 处理不同类型的参数替换
    switch (ruleType) {
        case 'max':
        case 'min':
            return template.replace('{value}', value);
        case 'length':
        case 'size':
            // 处理范围值格式 "min,max"
            if (value.includes(',')) {
                const [min, max] = value.split(',');
                return template.replace('{min}', min || '0').replace('{max}', max || '∞');
            }
            return template;
        case 'enum':
            // 处理枚举值，假设用逗号分隔
            return template.replace('{options}', value);
        default:
            return template;
    }
};
