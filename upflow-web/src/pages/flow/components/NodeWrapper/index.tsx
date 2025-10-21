import {Button, Dropdown, Flex, Space, theme} from "antd";
import React, {memo, useMemo} from "react";
import {
    CopyOutlined,
    DeleteOutlined,
    DownCircleOutlined,
    EllipsisOutlined, UpCircleOutlined
} from "@ant-design/icons";
import {NodeDefineTypes} from "@/pages/flow/nodeTypes";
import IconFont from '@/components/IconFont';
import styles from './styles.less'
import {cloneNode, deleteNode, extendNode, setHoveredNodeId} from "@/states/flow";
import {NodeType} from "@/types/flow";


const {useToken} = theme;


interface NodeWrapperProps {
    node: NodeType<any>,
    children?: React.ReactNode,
}

export default memo(({node, children}: NodeWrapperProps) => {
    // 从节点数据中获取展开状态，默认为true（展开）
    const expanded = node.data.expanded !== false;
    const {token} = useToken();
    
    const onDelete = (event: React.MouseEvent<HTMLDivElement>) => {
        deleteNode(node.id);
        event.stopPropagation();
    }
    const onClone = (event: React.MouseEvent<HTMLDivElement>) => {
        cloneNode(node.id);
        event.stopPropagation();
    }
    
    // 处理展开/收起点击
    const onToggleExpand = (event: React.MouseEvent<HTMLButtonElement>) => {
        extendNode(node.id);
        // 清除 hover 状态，确保端点样式正确消失
        setHoveredNodeId(null);
        event.stopPropagation();
    }
    
    const items = [
        {key: 'del', label: <div onClick={onDelete}><DeleteOutlined/> 删除</div>},
        {key: 'copy', label: <div onClick={onClone}><CopyOutlined/> 创建副本</div>}];

    const expandNode = useMemo(() => {
        return <Button type='text' size='small' icon={expanded ? <DownCircleOutlined/> : <UpCircleOutlined/>}
                       onClick={onToggleExpand}/>
    }, [expanded])

    return (
        <Flex vertical className={styles.wrapper}>
            <Flex align="center" justify={'space-between'} className={styles.header}>
                <Flex align='center' gap={5} style={{height: 32}}>
                    <IconFont type={NodeDefineTypes[node.type].icon} style={{color: token.colorPrimary, fontSize: 16}}/>
                    <span>{node.data.title}</span>
                </Flex>
                <Space size={0} className={styles.actionBtn}>
                    {node.data.group && expandNode}
                    <Dropdown menu={{items}} placement="bottom" arrow>
                        <Button type='text' size='small' icon={<EllipsisOutlined/>}/>
                    </Dropdown>
                </Space>
            </Flex>
            {children}
        </Flex>
    )
});