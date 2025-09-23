import {Button, Dropdown} from "antd";
import React, {memo} from "react";
import {CopyOutlined, DeleteOutlined, EllipsisOutlined} from "@ant-design/icons";
import {NodeToolbar, Position} from "@xyflow/react";
import {flowActions} from "@/states/flow";

interface NodeWrapperProps {
    id: string,
    selected: boolean,
    children: React.ReactNode,
}

export default memo(({children, ...restProps}: NodeWrapperProps) => {


    const onDelete = () => {
        flowActions.deleteNode(restProps.id);
    }
    const onCopy = () => {
        flowActions.copyNode(restProps.id);
    }

    const items = [
        {key: 'del', label: <div onClick={onDelete}><DeleteOutlined/> 删除</div>},
        {key: 'copy', label: <div onClick={onCopy}><CopyOutlined/> 拷贝</div>}];
    return (
        <div style={{width: '100%', height: '100%'}} >
            <NodeToolbar isVisible={restProps.selected} position={Position.Top} align={'end'}
                         style={{marginTop: 5}}>
                <Dropdown menu={{items}} placement="bottom" arrow>
                    <Button size='small' icon={<EllipsisOutlined/>}/>
                </Dropdown>
            </NodeToolbar>
            {children}

        </div>
    )
});