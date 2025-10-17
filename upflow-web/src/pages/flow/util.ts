import {Node} from '@xyflow/react';
import {NodeType} from "@/typings";

// 确保父节点在子节点之前的排序函数（高性能、稳定顺序）
export const sortNodes = (nodes: NodeType<any>[]) => {
    if (nodes.length === 0) return [];

    // 构建 map: id -> node
    const nodeMap = new Map<string, NodeType<any>>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    // 构建 parentId -> children
    const childrenMap = new Map<string, NodeType<any>[]>();
    nodes.forEach(n => {
        if (n.parentId) {
            if (!childrenMap.has(n.parentId)) {
                childrenMap.set(n.parentId, []);
            }
            childrenMap.get(n.parentId)!.push(n);
        }
    });

    const visited = new Set<string>();
    const result: NodeType<any>[] = [];

    function dfs(node: NodeType<any>) {
        if (visited.has(node.id)) return;
        visited.add(node.id);

        result.push(node);

        const children = childrenMap.get(node.id) || [];
        for (const child of children) {
            dfs(child);
        }
    }

    // 从顶层节点开始（没有 parentId 的）
    for (const node of nodes) {
        if (!node.parentId) {
            dfs(node);
        }
    }

    return result;

};

// 获取节点的所有子节点（包括嵌套的子节点）
export const getAllChildrenIds = (nodeId: string, nodes: readonly NodeType<any>[]): string[] => {
    const childrenIds: string[] = [];

    // 递归查找所有子节点
    const findChildren = (parentId: string) => {
        nodes.forEach(node => {
            if (node.parentId === parentId) {
                childrenIds.push(node.id);
                // 递归查找这个节点的子节点
                findChildren(node.id);
            }
        });
    };

    findChildren(nodeId);
    return childrenIds;
};

// 计算节点的绝对位置（考虑所有祖先节点的位置累加）
export const getNodeAbsolutePosition = (nodeId: string, nodes: readonly Node[]): { x: number; y: number } => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
        return {x: 0, y: 0};
    }

    // 如果没有父节点，直接返回当前位置
    if (!node.parentId) {
        return {x: node.position.x, y: node.position.y};
    }

    // 递归计算父节点的绝对位置，然后加上当前节点的相对位置
    const parentAbsolutePosition = getNodeAbsolutePosition(node.parentId, nodes);
    return {
        x: parentAbsolutePosition.x + node.position.x,
        y: parentAbsolutePosition.y + node.position.y
    };
};