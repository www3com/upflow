import {Button, Dropdown} from "antd";
import {memo} from "react";
import {CopyOutlined, DeleteOutlined, EllipsisOutlined} from "@ant-design/icons";
import {NodeToolbar, Position} from "@xyflow/react";

interface NodeMenuProps {
    type: string,
    selected: boolean,
    data: {
        title: string,
        input: []
    }
}

export default memo(({type, data}: NodeMenuProps) => {

    const items = [{
        key: '1',
        label: <><DeleteOutlined/> 删除</>,
    }, {
        key: '2',
        label: <><CopyOutlined/> 复制</>,
    }];
    return (
        <>
            <NodeToolbar position={Position.Top} align={'end'} style={{marginTop: 5}}>
                <Dropdown menu={{items}} placement="bottom" arrow>
                    <Button variant="filled" size='small' icon={<EllipsisOutlined/>}/>
                </Dropdown>
            </NodeToolbar>
        </>
    )
});