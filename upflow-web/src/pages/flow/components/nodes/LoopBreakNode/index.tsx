import {memo} from "react";
import {Handle, Position} from "@xyflow/react";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import {NodeType} from "@/typings";

export default memo((node: NodeType) => {
    return (
        <NodeWrapper node={node}>
            <Handle type="target" position={Position.Left}/>
        </NodeWrapper>
    )
});