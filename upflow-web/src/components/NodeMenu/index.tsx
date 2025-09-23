import {Button, Dropdown} from "antd";
import {memo} from "react";
import {CopyOutlined, DeleteOutlined, EllipsisOutlined} from "@ant-design/icons";
import {NodeToolbar, Position} from "@xyflow/react";

interface NodeMenuProps {
    onSelect: (key: string) => void;
}

export default memo(({onSelect}: NodeMenuProps) => {

    const items = [{
        key: 'del',
        label: <div onClick={() => onSelect('del')}><DeleteOutlined/> 删除</div>,
    }, {
        key: 'copy',
        label: <div onClick={() => onSelect('copy')}><CopyOutlined/> 复制</div>,
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