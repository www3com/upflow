import {memo} from "react";
import {FunctionOutlined} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";
import NodeWrapper from "@/pages/flow/components/NodeWrapper";

interface ScriptNodeProps {
    id: string;
}

export default memo(({id}: ScriptNodeProps) => {
    return (
        <NodeWrapper id={id}>
            <div style={{minWidth: 200}}><FunctionOutlined/> 代码执行</div>
            <Handle type="target" position={Position.Left}/>
            <Handle type="source" position={Position.Right} id='a' style={{top: 10}}/>
        </NodeWrapper>
    )
});