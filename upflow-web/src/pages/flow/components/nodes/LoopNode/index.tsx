import {memo} from "react";
import {Handle, Position} from "@xyflow/react";
import {LoopNodeType, NodeType} from "@/types/flow";
import GroupNodeWrapper from "@/pages/flow/components/GroupNodeWrapper";


export default memo((node: NodeType<LoopNodeType>) => {
    return (
        <GroupNodeWrapper node={node}>
            <Handle type="source" position={Position.Right}/>
            <Handle type="target" position={Position.Left}/>
        </GroupNodeWrapper>

    )
});