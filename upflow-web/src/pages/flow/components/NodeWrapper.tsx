import {Button, Dropdown, Flex, theme} from "antd";
import React, {memo, useState} from "react";
import {CopyOutlined, createFromIconfontCN, DeleteOutlined, EllipsisOutlined} from "@ant-design/icons";
import {IconFontUrl, NodeTypes} from "@/utils/constants";
import styles from '../styles.less'

const {useToken} = theme;

const IconFont = createFromIconfontCN({
    scriptUrl: IconFontUrl,
});


interface NodeWrapperProps {
    id: string,
    type: string,
    title: string
    children?: React.ReactNode,
}

export default memo(({children, ...restProps}: NodeWrapperProps) => {

    const onDelete = (e: React.MouseEvent) => {
        e.stopPropagation();

    }
    const onCopy = (e: React.MouseEvent) => {
        e.stopPropagation();

    }

    const {token} = useToken();

    const items = [
        {key: 'del', label: <div onClick={onDelete}><DeleteOutlined/> 删除</div>},
        {key: 'copy', label: <div onClick={onCopy}><CopyOutlined/> 拷贝</div>}];

    return (
        <Flex vertical className={styles.nodeWrapper}>
            <Flex justify={'space-between'} className={styles.nodeHeader}>
                <Flex align='center' gap={5} style={{height: 32}}>
                    <IconFont type={NodeTypes[restProps.type].icon} style={{color: token.colorPrimary, fontSize: 16}}/>
                    <span>{restProps.title}</span>
                </Flex>
                <Dropdown menu={{items}} placement="bottom" arrow>
                    <Button type='text' size='small' icon={<EllipsisOutlined/>} className={styles.nodeActionBtn}/>
                </Dropdown>
            </Flex>
            {children}
        </Flex>
    )
});