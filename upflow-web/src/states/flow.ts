import {Node, Edge} from '@xyflow/react';
import {proxy} from "valtio";
import {nanoid} from "nanoid";
import {getFlowApi} from "@/services/flow";
import {NODE_TYPE, NodeDefineTypes} from "@/utils/nodeTypes";
import {getAllChildrenIds, newId, sortNodes} from "@/utils/flow";
import {message} from "antd/lib";
import {NodeType} from "@/typings";

interface NodeSize {
    id: string;
    width: number,
    height: number
}

const NodeSizeMap: Record<string, NodeSize> = {};

export const state = proxy({
    nodes: [] as Node[],
    edges: [] as Edge[],
    selectedNode: null as NodeType | null,
    hoveredNodeId: null as string | null,
});


export const init = async () => {
    const res = await getFlowApi();
    state.nodes = res.data!.nodes;
    state.edges = res.data!.edges;
}

export const setSelectedNode = (node: NodeType | null) => {
    state.selectedNode = node;
}

export const setHoveredNodeId = (nodeId: string | null) => {
    state.hoveredNodeId = nodeId;
}

export const saveFlow = () => {
    // 根据 NodeSizeMap 更新 nodes 的尺寸
    const updatedNodes = state.nodes.map(node => {
        const savedSize = NodeSizeMap[node.id];
        if (savedSize) {
            return {
                ...node,
                width: savedSize.width,
                height: savedSize.height
            };
        }
        return node;
    });

    const flowData = {
        nodes: updatedNodes,
        edges: state.edges,
    };
    console.log(JSON.stringify(flowData));
}

export const exportDSL = () => {
    try {
        // 检查是否有数据可导出
        if (state.nodes.length === 0 && state.edges.length === 0) {
            message.warning('当前流程为空，无法导出！');
            return;
        }

        // 更新节点尺寸信息
        const updatedNodes = state.nodes.map(node => {
            const savedSize = NodeSizeMap[node.id];
            if (savedSize) {
                return {
                    ...node,
                    width: savedSize.width,
                    height: savedSize.height
                };
            }
            return node;
        });

        // 生成更友好的文件名
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
        const fileName = `flow-${dateStr}-${timeStr}.dsl`;

        // 构建导出数据
        const flowData = {
            nodes: updatedNodes,
            edges: state.edges,
            version: '1.0',
            timestamp: now.toISOString(),
            metadata: {
                nodeCount: updatedNodes.length,
                edgeCount: state.edges.length,
                exportedBy: 'UpFlow',
            }
        };

        // 创建并下载文件
        const dataStr = JSON.stringify(flowData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        message.success(`DSL 导出成功！文件名：${fileName}`);
    } catch (error) {
        console.error('导出 DSL 失败:', error);
        message.error('导出 DSL 失败，请重试！');
    }
}

export const importDSL = (file: File) => {
    // 文件类型验证
    if (!file.name.endsWith('.dsl')) {
        message.error('请选择 .dsl 格式的文件！');
        return;
    }

    // 文件大小验证 (限制为 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        message.error('文件大小不能超过 10MB！');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const content = e.target?.result as string;
            
            if (!content || content.trim() === '') {
                message.error('文件内容为空！');
                return;
            }

            const flowData = JSON.parse(content);
            
            // 详细的数据结构验证
            if (!flowData || typeof flowData !== 'object') {
                message.error('无效的文件格式：不是有效的 JSON 对象！');
                return;
            }

            if (!Array.isArray(flowData.nodes)) {
                message.error('无效的文件格式：缺少 nodes 数组！');
                return;
            }

            if (!Array.isArray(flowData.edges)) {
                message.error('无效的文件格式：缺少 edges 数组！');
                return;
            }

            // 验证节点数据结构
            const invalidNodes = flowData.nodes.filter((node: any) => 
                !node.id || !node.type || !node.position || !node.data
            );
            
            if (invalidNodes.length > 0) {
                message.error(`发现 ${invalidNodes.length} 个无效节点，请检查文件格式！`);
                return;
            }

            // 验证边数据结构
            const invalidEdges = flowData.edges.filter((edge: any) => 
                !edge.id || !edge.source || !edge.target
            );
            
            if (invalidEdges.length > 0) {
                message.error(`发现 ${invalidEdges.length} 个无效连接，请检查文件格式！`);
                return;
            }

            // 确认导入操作
            const nodeCount = flowData.nodes.length;
            const edgeCount = flowData.edges.length;
            
            if (state.nodes.length > 0 || state.edges.length > 0) {
                // 如果当前有数据，提示用户
                const confirmMessage = `即将导入 ${nodeCount} 个节点和 ${edgeCount} 个连接，这将覆盖当前流程。是否继续？`;
                if (!window.confirm(confirmMessage)) {
                    return;
                }
            }

            // 执行导入
            state.nodes = flowData.nodes;
            state.edges = flowData.edges;
            
            // 清空选中状态
            state.selectedNode = null;
            
            const importInfo = flowData.metadata 
                ? `导入成功！版本：${flowData.version || '未知'}，节点：${nodeCount}，连接：${edgeCount}`
                : `导入成功！节点：${nodeCount}，连接：${edgeCount}`;
                
            message.success(importInfo);
            
        } catch (error) {
            console.error('导入 DSL 失败:', error);
            if (error instanceof SyntaxError) {
                message.error('文件格式错误：不是有效的 JSON 格式！');
            } else {
                message.error('导入失败，请检查文件格式！');
            }
        }
    };

    reader.onerror = () => {
        message.error('文件读取失败，请重试！');
    };

    reader.readAsText(file, 'UTF-8');
}

export const addComment = (position: { x: number, y: number }) => {
    try {
        const commentNode: Node = {
            id: nanoid(8),
            type: 'comment',
            position,
            data: {
                title: '注释',
                detail: '请输入注释内容...',
                group: false,
            },
            style: {
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                padding: '10px',
                minWidth: '200px',
                minHeight: '80px',
            },
            draggable: true,
            selectable: true,
        };

        // 添加注释节点到状态中
        state.nodes = [...state.nodes, commentNode];
        
        // 设置为选中状态，方便用户立即编辑
        state.selectedNode = commentNode as NodeType;
        
        message.success('注释节点添加成功！');
        
        return commentNode;
    } catch (error) {
        console.error('添加注释节点失败:', error);
        message.error('添加注释节点失败，请重试！');
    }
}

export const addNode = (type: string, position: { x: number, y: number }) => {
    let startNode = state.nodes.find(n => n.type === NODE_TYPE.START);
    if (type === NODE_TYPE.START && startNode) {
        message.info('流程中只能有一个开始节点！');
        return;
    }
    createNode(type, position);
}
export const updateNode = (node: Node) => {
    let nodes = state.nodes.map(n => n.id === node.id ? node : n);
    state.nodes = sortNodes(nodes)
}

export const deleteNode = (nodeId: string) => {
    let childrenNodes = getAllChildrenIds(nodeId, state.nodes);
    let nodes = state.nodes.filter(n => n.id !== nodeId && !childrenNodes.includes(n.id));
    let edges = state.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    state.nodes = nodes;
    state.edges = edges;
    
    // 如果被删除的节点是当前选中的节点，清除选中状态
    if (state.selectedNode && state.selectedNode.id === nodeId) {
        state.selectedNode = null;
    }
}

export const cloneNode = (nodeId: string) => {
    // 找到要克隆的节点
    const sourceNode = state.nodes.find(n => n.id === nodeId);
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
    const clonedNode: Node = {
        ...sourceNode,
        id: nanoid(8),
        data: clonedData,
        zIndex: sourceNode.zIndex! + 1,
        selected: false,
        position: {
            x: sourceNode.position.x + 50, // 向右偏移50px
            y: sourceNode.position.y + 50  // 向下偏移50px
        }
    };

    // 添加克隆节点到状态中
    state.nodes = state.nodes.concat(clonedNode);
}

export const setNodes = (nodes: Node[]) => {
    state.nodes = nodes;
}

export const setEdges = (edges: Edge[]) => {
    state.edges = edges;
}

export const extendNode = (nodeId: string) => {
    let currentNode = state.nodes.find(n => n.id === nodeId);
    if (!currentNode) {
        console.warn(`Node with id ${nodeId} not found`);
        return;
    }

    let childrenNodeIds = getAllChildrenIds(nodeId, state.nodes);

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
            expanded: newExpanded
        }
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
                height: currentNode.height || nodeConfig.defaultConfig?.height || 100
            };

            // 缩小尺寸，只显示标题栏
            updatedNode.width = Math.min(currentNode.width || 220, 220);
            updatedNode.height = 40; // 只保留标题栏高度
        }
    }

    // 更新所有子节点的隐藏状态
    const updatedNodes = state.nodes.map(node => {
        if (node.id === nodeId) {
            return updatedNode;
        }

        // 处理子节点的显示/隐藏
        if (childrenNodeIds.includes(node.id)) {
            return {
                ...node,
                hidden: !newExpanded // 收起时隐藏子节点，展开时显示子节点
            };
        }

        return node;
    });

    // 更新状态
    state.nodes = updatedNodes;
}

const createNode = (type: string, position: { x: number, y: number }) => {
    let node = NodeDefineTypes[type];
    let id = newId();
    let nodes: Node[] = [];
    const newNode: Node = {
        id, type, position,
        width: node.defaultConfig?.width,
        height: node.defaultConfig?.height,
        data: {...node.defaultConfig?.data},
        extent: 'parent',
    };
    nodes.push(newNode);

    if (type === NODE_TYPE.LOOP) {
        let forStartNodeCfg = NodeDefineTypes[NODE_TYPE.LOOP_START];
        const forStartNode = {
            ...forStartNodeCfg.defaultConfig,
            type: NODE_TYPE.LOOP_START,
            position: forStartNodeCfg.defaultConfig?.position!,
            data: {...forStartNodeCfg.defaultConfig?.data},
            id: newId(),
            parentId: id
        };
        nodes.push(forStartNode);
    }

    state.nodes.push(...nodes);
}
