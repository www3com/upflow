import React, {memo, useState} from "react";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import NodeResizeControl from "@/pages/flow/components/NodeResizeControl";
import {NodeType} from "@/types/flow";

interface GroupNodeWrapperProps {
    node: NodeType<any>,
    children?: React.ReactNode,
}

export default memo(({node, children}: GroupNodeWrapperProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{height: '100%', width: '100%'}}
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}
        >
            <NodeWrapper node={node}>
                {node.data.group && isHovered && node.data.expanded && (<NodeResizeControl/>)}
                {children}
            </NodeWrapper>
        </div>
    )
});