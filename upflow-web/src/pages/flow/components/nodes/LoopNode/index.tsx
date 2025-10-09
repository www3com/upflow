import {memo, useState} from "react";
import {Handle, Position} from "@xyflow/react";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import NodeResizeControl from "@/pages/flow/components/NodeResizeControl";
import {NodeType} from "@/typings";


export default memo((node: NodeType) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{height: '100%', width: '100%'}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <NodeWrapper node={node}>
                {node.data.group && isHovered && (<NodeResizeControl/>)}
                <Handle type="source" position={Position.Right}/>
                <Handle type="target" position={Position.Left}/>
                <Handle type="source" position={Position.Right}/>
            </NodeWrapper>
        </div>
    )
});