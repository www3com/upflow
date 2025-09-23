import { Node } from '@xyflow/react';

// 确保父节点在子节点之前的排序函数（高性能、稳定顺序）
export const sortNodesByParentChild = (nodes: Node[]) => {
    if (!nodes || nodes.length === 0) return [];

    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // 初始化邻接表与入度
    for (const n of nodes) {
        adj.set(n.id, []);
        inDegree.set(n.id, 0);
    }

    // 构建父 -> 子关系，并计算入度
    for (const n of nodes) {
        const parentId = (n as any).parentId as string | undefined;
        if (parentId && nodeMap.has(parentId)) {
            adj.get(parentId)!.push(n.id);
            inDegree.set(n.id, (inDegree.get(n.id) || 0) + 1);
        }
    }

    // 使用原数组顺序作为稳定的队列初始化，保证同层节点尽量保持原顺序
    const queue: string[] = [];
    for (const n of nodes) {
        if ((inDegree.get(n.id) || 0) === 0) queue.push(n.id);
    }

    const orderedIds: string[] = [];
    while (queue.length > 0) {
        const u = queue.shift()!;
        orderedIds.push(u);
        const children = adj.get(u) || [];
        for (const v of children) {
            const d = (inDegree.get(v) || 0) - 1;
            inDegree.set(v, d);
            if (d === 0) queue.push(v);
        }
    }

    // 若存在环或异常关系，补齐剩余节点（保持原顺序）
    if (orderedIds.length < nodes.length) {
        const setIds = new Set(orderedIds);
        for (const n of nodes) {
            if (!setIds.has(n.id)) orderedIds.push(n.id);
        }
    }

    return orderedIds.map(id => nodeMap.get(id)!).filter(Boolean);
};