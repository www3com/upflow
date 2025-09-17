import {
    Node,
    Edge,
    Background,
    Controls,
    ReactFlow,
    addEdge, Panel, BackgroundVariant, useNodesState, useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useCallback, useEffect, useState} from 'react';
import {nodeTypes} from './initNodes';
import './xy-theme.css'
import {Button, Flex, Space} from "antd";
import AttributePanel from "@/pages/flow/components/AttributePanel";
import {getFlowApi} from "@/services/flow";

export default () => {
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<Node>();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const init = async () => {
        const res = await getFlowApi();
        setNodes(res.data!.nodes);
        setEdges(res.data!.edges);
    }

    useEffect(() => {
        init();
    }, [])


    const onConnect = useCallback(
        (params: any) => setEdges((eds: any[]) => addEdge(params, eds)),
        [setEdges]
    );

    const onSelectionChange = useCallback(({nodes: selectedNodes}: { nodes: Node[] }) => {
        if (selectedNodes.length == 0) {
            setOpen(false)
        } else {
            setOpen(true)
            setNode(selectedNodes[0])
        }
    }, []);

    const onSave = useCallback(() => {
        const flowData = {nodes, edges};
        console.log(JSON.stringify(flowData))
    }, [nodes, edges]);

    const onChange = (node: Node) => {
        console.log("改变的节点", node)
    }

    return (
        <div style={{width: '100%', height: '100%'}}>
            <ReactFlow
                proOptions={{hideAttribution: true}}
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
            >
                <Panel position="top-right">
                    <Space>
                        <Button onClick={onSave} color="primary" variant="outlined">预览</Button>
                        <Button type='primary' onClick={onSave}>保存</Button>
                    </Space>
                </Panel>
                <AttributePanel open={open} node={node} onChange={onChange}/>
                <Controls/>
                <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
            </ReactFlow>
        </div>
    );
}
