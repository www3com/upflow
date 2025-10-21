import {memo} from "react";
import {Handle, Position} from "@xyflow/react";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import {CodeNodeType, NodeType} from "@/types/flow";

export default memo((node: NodeType<CodeNodeType>) => {
    return (
        <NodeWrapper node={node}>
            <Handle type="target" position={Position.Left}/>
            <Handle type="source" position={Position.Right}/>
        </NodeWrapper>
    )
});