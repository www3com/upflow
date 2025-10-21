import {memo} from "react";
import {Handle, Position} from "@xyflow/react";
import GroupNodeWrapper from "@/pages/flow/components/GroupNodeWrapper";
import {NodeType, SqlTransactionNodeType} from "@/types/flow";

export default memo((node: NodeType<SqlTransactionNodeType>) => {
    return (
        <GroupNodeWrapper node={node}>
            <Handle type="source" position={Position.Right}/>
            <Handle type="target" position={Position.Left}/>
        </GroupNodeWrapper>
    )
});