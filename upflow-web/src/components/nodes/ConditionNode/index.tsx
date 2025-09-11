import {Card} from "antd";
import {memo} from "react";
import {HomeOutlined, PartitionOutlined} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";
const { Meta } = Card;
export default memo(() => {
    return (
        <>
            <div style={{minWidth:200}}><PartitionOutlined /> 条件分支</div>
            <Handle type="source" position={Position.Left}/>
            <Handle type="target" position={Position.Right} id='a' style={{top: 10}} />
            <Handle type="target" position={Position.Right} id='b' style={{top: 30}}/>
        </>
    )
});