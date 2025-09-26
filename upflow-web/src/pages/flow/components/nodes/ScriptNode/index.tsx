import {memo} from "react";
import {FunctionOutlined} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";

interface ScriptNodeProps {
    id: string;
    type: string;
    data: {
        title: string,
        input: []
    }
}

export default memo(({id, type, data}: ScriptNodeProps) => {
    return (
        <NodeWrapper id={id} type={type} data={data}>
            <Handle type="target" position={Position.Left}/>
            <Handle type="source" position={Position.Right}/>
            无内容
        </NodeWrapper>
    )
});