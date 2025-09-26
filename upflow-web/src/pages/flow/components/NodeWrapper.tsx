import {Button, Dropdown, Flex, Space, theme} from "antd";
import React, {memo, useMemo} from "react";
import {
    CopyOutlined,
    createFromIconfontCN,
    DeleteOutlined,
    DownCircleOutlined,
    EllipsisOutlined, UpCircleOutlined
} from "@ant-design/icons";
import {IconFontUrl, NodeTypes} from "@/utils/constants";
import styles from '../styles.less'
import {cloneNode, deleteNode, extendNode} from "@/states/flow";


const {useToken} = theme;

const IconFont = createFromIconfontCN({
    scriptUrl: IconFontUrl,
});


interface NodeWrapperProps {
    id: string,
    type: string,
    children?: React.ReactNode,
    data?: any, // 添加data属性以获取节点状态
    onExpand?: (expanded: boolean) => void,
}

export default memo(({children, ...restProps}: NodeWrapperProps) => {
    // 从节点数据中获取展开状态，默认为true（展开）
    const expanded = restProps.data?.expanded !== false;
    const {token} = useToken();
    
    const onDelete = (event: React.MouseEvent<HTMLDivElement>) => {
        deleteNode(restProps.id);
        event.stopPropagation();
    }
    const onClone = (event: React.MouseEvent<HTMLDivElement>) => {
        cloneNode(restProps.id);
        event.stopPropagation();
    }
    
    // 处理展开/收起点击
    const onToggleExpand = (event: React.MouseEvent<HTMLButtonElement>) => {
        // setHoveredNodeId(null)
        extendNode(restProps.id);
        restProps.onExpand?.(expanded);
        event.stopPropagation();
    }
    
    const items = [
        {key: 'del', label: <div onClick={onDelete}><DeleteOutlined/> 删除</div>},
        {key: 'copy', label: <div onClick={onClone}><CopyOutlined/> 拷贝</div>}];

    const expandNode = useMemo(() => {
        return <Button type='text' size='small' icon={expanded ? <DownCircleOutlined/> : <UpCircleOutlined/>}
                       onClick={onToggleExpand}/>
    }, [expanded])

    return (
        <Flex vertical className={styles.nodeWrapper}>
            <Flex align="center" justify={'space-between'} className={styles.nodeHeader}>
                <Flex align='center' gap={5} style={{height: 32}}>
                    <IconFont type={NodeTypes[restProps.type].icon} style={{color: token.colorPrimary, fontSize: 16}}/>
                    <span>{restProps.data.title}</span>
                </Flex>
                <Space size={0} className={styles.nodeActionBtn}>
                    {restProps.data.isContainer && expandNode}
                    <Dropdown menu={{items}} placement="bottom" arrow>
                        <Button type='text' size='small' icon={<EllipsisOutlined/>}/>
                    </Dropdown>
                </Space>
            </Flex>
            {children}
        </Flex>
    )
});