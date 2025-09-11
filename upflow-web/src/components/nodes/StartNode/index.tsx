import {Card} from "antd";
import {memo} from "react";
import {HomeOutlined, PartitionOutlined} from "@ant-design/icons";
import {Handle, Position} from "@xyflow/react";

const {Meta} = Card;

export default memo(() => {
    return (
        <>
            <div style={{minWidth:200, fontWeight: 'bold'}}><HomeOutlined/> 开始</div>
            <Handle type="target" position={Position.Right}/>
        </>

    )
});