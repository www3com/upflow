import {memo} from "react";
import {Handle,  Position} from "@xyflow/react";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import NodeResizeControl from "@/pages/flow/components/NodeResizeControl";


interface ForNodeProps {
    id: string,
    type: string,
    selected: boolean,
    data: {
        title: string,
        input: []
    }
}

export default memo((props: ForNodeProps) => {
    return (
        <NodeWrapper id={props.id} type={props.type} title={props.data.title}>
                <NodeResizeControl/>

                <Handle type="source" position={Position.Right}/>
                <Handle type="target" position={Position.Left}/>
                <Handle type="source" position={Position.Right}/>

        </NodeWrapper>
    )
});