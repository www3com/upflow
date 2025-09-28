import {memo} from "react";
import {Handle, Position} from "@xyflow/react";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import NodeResizeControl from "@/pages/flow/components/NodeResizeControl";
import {NodeType} from "@/typings";


export default memo((node: NodeType) => {
    return (
        <NodeWrapper
            node={node}
        >
            {node.data.expanded && (<NodeResizeControl/>)}
            <Handle type="source" position={Position.Right}/>
            <Handle type="target" position={Position.Left}/>
            <Handle type="source" position={Position.Right}/>

        </NodeWrapper>
    )
});