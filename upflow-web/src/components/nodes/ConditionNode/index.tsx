import {Card, Flex} from "antd";
import {memo} from "react";
import {HomeOutlined, PartitionOutlined} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";

export default memo(() => {
    return (
        <>
            <Flex>
                <PartitionOutlined /> 条件分支
            </Flex>
            <Handle type="source" position={Position.Left}/>
            <Handle type="target" position={Position.Right} id='a' style={{top: 10}} />
            <Handle type="target" position={Position.Right} id='b' style={{top: 30}}/>
        </>
    )
});