import {useCallback, useEffect, useMemo} from "react";
import {
    changeConnect,
    changeEdges,
    changeNodes,
    init,
    state
} from "@/states/flow";
import {useSnapshot} from "valtio";
import '@xyflow/react/dist/style.css';
import {Button, Space, Splitter} from "antd";
import ComponentPanel from "@/pages/flow/components/ComponentPanel";
import {Background, BackgroundVariant, Controls, Edge, Panel, ReactFlow} from "@xyflow/react";
import AttributePanel from "@/pages/flow/components/AttributePanel";
import {NodeTypes} from "@/utils/constants";

export default function Flow1() {

    const {nodes, edges} = useSnapshot(state);

    useEffect(() => {
        init()
    }, []);

    const nodeTypes = useMemo(() => {
        return Object.fromEntries(
            Object.entries(NodeTypes).map(([key, value]) => [key, value.node])
        );
    }, []);

    const onNodesChange = useCallback(changeNodes, []);
    const onEdgesChange = useCallback(changeEdges, []);
    const onConnect = useCallback(changeConnect, []);

    const onSave = useCallback(() => {
        const flowData = {nodes, edges};
        console.log(JSON.stringify(flowData));
    }, [nodes, edges]);

    return (
        <Splitter style={{height: '100%'}}>
            <Splitter.Panel defaultSize="160" min='5%' max="20%"
                            collapsible={{start: false, end: true, showCollapsibleIcon: 'auto'}}>
                <ComponentPanel/>
            </Splitter.Panel>
            <Splitter.Panel>
                <ReactFlow
                    proOptions={{hideAttribution: true}}
                    nodeTypes={nodeTypes}
                    nodes={nodes as any}
                    edges={edges as Edge[]}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Panel position="top-right">
                        <Space>
                            <Button onClick={onSave} color="primary" variant="outlined">运行</Button>
                            <Button type='primary' onClick={onSave}>保存</Button>
                        </Space>
                    </Panel>
                    <Controls/>
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
                </ReactFlow>
            </Splitter.Panel>
        </Splitter>
    );
}
