import {memo} from "react";
import {Handle, Position} from "@xyflow/react";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";
import NodeResizeControl from "@/pages/flow/components/NodeResizeControl";


interface ForNodeProps {
    id: string,
    type: string,
    selected: boolean,
    data: {
        isContainer: boolean,
        title: string,
        input: [],
        expanded?: boolean, // 添加expanded属性
    }
}

export default memo((props: ForNodeProps) => {
    return (
        <NodeWrapper
            id={props.id}
            type={props.type}
            data={props.data}
        >
            {props.data.expanded && (<NodeResizeControl/>)}
            <Handle type="source" position={Position.Right}/>
            <Handle type="target" position={Position.Left}/>
            <Handle type="source" position={Position.Right}/>

        </NodeWrapper>
    )
});