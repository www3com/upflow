import {memo} from "react";
import {Handle, Position} from "@xyflow/react";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import {NodeType} from "@/types/flow";

export default memo((node: NodeType<any>) => {
    return (
        <NodeWrapper node={node}>
            <Handle type="target" position={Position.Left}/>
        </NodeWrapper>
    )
});