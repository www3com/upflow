import {memo} from "react";
import {Handle, Position} from "@xyflow/react";
import {NodeType, SqlNodeType} from "@/types/flow";
import GroupNodeWrapper from "@/pages/flow/components/GroupNodeWrapper";


export default memo((node: NodeType<SqlNodeType>) => {
    return (
        <GroupNodeWrapper node={node}>
            <Handle type="source" position={Position.Right}/>
            <Handle type="target" position={Position.Left}/>
        </GroupNodeWrapper>
    )
});