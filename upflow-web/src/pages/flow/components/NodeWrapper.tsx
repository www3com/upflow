import {Button, Dropdown} from "antd";
import React, {memo, useState, useRef, useCallback} from "react";
import {CopyOutlined, DeleteOutlined, EllipsisOutlined} from "@ant-design/icons";
import {NodeToolbar, Position} from "@xyflow/react";
import {flowActions} from "@/states/flow";

interface NodeWrapperProps {
    id: string,
    selected: boolean,
    children: React.ReactNode,
}

export default memo(({children, ...restProps}: NodeWrapperProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const nodeRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);

    const onDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        flowActions.deleteNode(restProps.id);
    }
    const onCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        flowActions.copyNode(restProps.id);
    }

    const clearHideTimeout = useCallback(() => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
        }
    }, []);

    const handleMouseEnter = useCallback(() => {
        clearHideTimeout();
        setIsHovered(true);
    }, [clearHideTimeout]);

    const handleMouseLeave = useCallback((e: React.MouseEvent) => {
        // 如果下拉菜单是打开的，不隐藏工具栏
        if (isDropdownOpen) {
            return;
        }
        
        // 检查鼠标是否移动到了 NodeToolbar 区域
        const relatedTarget = e.relatedTarget as Element;
        if (toolbarRef.current && relatedTarget && toolbarRef.current.contains(relatedTarget)) {
            return; // 如果鼠标移动到工具栏，不隐藏
        }
        
        // 延迟隐藏，给用户时间移动到工具栏
        hideTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
        }, 100);
    }, [isDropdownOpen]);

    const handleToolbarMouseEnter = useCallback(() => {
        clearHideTimeout();
        setIsHovered(true);
    }, [clearHideTimeout]);

    const handleToolbarMouseLeave = useCallback(() => {
        // 如果下拉菜单是打开的，不隐藏工具栏
        if (isDropdownOpen) {
            return;
        }
        
        hideTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
        }, 100);
    }, [isDropdownOpen]);

    const handleDropdownOpenChange = useCallback((open: boolean) => {
        setIsDropdownOpen(open);
        if (open) {
            // 菜单打开时，清除隐藏定时器并保持显示
            clearHideTimeout();
            setIsHovered(true);
        } else {
            // 菜单关闭时，延迟隐藏工具栏
            hideTimeoutRef.current = setTimeout(() => {
                setIsHovered(false);
            }, 100);
        }
    }, [clearHideTimeout]);

    const items = [
        {key: 'del', label: <div onClick={onDelete}><DeleteOutlined/> 删除</div>},
        {key: 'copy', label: <div onClick={onCopy}><CopyOutlined/> 拷贝</div>}];
    
    return (
        <div 
            ref={nodeRef}
            style={{width: '100%', height: '100%'}} 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <NodeToolbar 
                isVisible={restProps.selected || isHovered || isDropdownOpen}
                position={Position.Top} 
                align={'end'}
                style={{marginTop: 5}}
            >
                <div 
                    ref={toolbarRef}
                    onMouseEnter={handleToolbarMouseEnter}
                    onMouseLeave={handleToolbarMouseLeave}
                >
                    <Dropdown 
                        menu={{items}} 
                        placement="bottom" 
                        arrow
                        onOpenChange={handleDropdownOpenChange}
                    >
                        <Button size='small' icon={<EllipsisOutlined/>}/>
                    </Dropdown>
                </div>
            </NodeToolbar>
            {children}
        </div>
    )
});