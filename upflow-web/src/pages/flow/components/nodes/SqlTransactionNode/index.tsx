import {memo} from "react";
import {Handle, Position} from "@xyflow/react";
import {NodeType, SqlTransactionNodeType} from "@/typings";
import GroupNodeWrapper from "@/pages/flow/components/GroupNodeWrapper";

export default memo((node: NodeType<SqlTransactionNodeType>) => {
    return (
        <GroupNodeWrapper node={node}>
            <Handle type="source" position={Position.Right}/>
            <Handle type="target" position={Position.Left}/>
        </GroupNodeWrapper>
    )
});