import React, {useMemo, useRef} from 'react';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {NodeDefineTypes} from '@/pages/flow/nodeTypes';
import IconFont from '@/components/IconFont';

// 类型定义
interface Position {
    x: number;
    y: number;
}

interface ContextMenuProps {
    visible: boolean;
    position: Position;
    onClose: () => void;
    onContextMenu: (event: React.MouseEvent) => void;
    onAddNode: (nodeType: string) => void;
    onAddComment: () => void;
    onExportDSL: () => void;
    onImportDSL: (file: File) => void;
}

// 常量配置
const MENU_CONFIG = {
    zIndex: {
        overlay: 999,
        menu: 1000,
    },
    style: {
        overlay: {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        menu: {
            position: 'fixed' as const,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            borderRadius: '6px',
        },
        hiddenInput: {
            display: 'none' as const,
        },
    },
    icon: {
        size: 16,
    },
    fileAccept: '.dsl',
} as const;

const ContextMenu: React.FC<ContextMenuProps> = ({
                                                     visible,
                                                     position,
                                                     onClose,
                                                     onContextMenu,
                                                     onAddNode,
                                                     onAddComment,
                                                     onExportDSL,
                                                     onImportDSL,
                                                 }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 处理文件导入
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImportDSL(file);
            onClose();
        }
        // 清空文件输入，允许重复选择同一文件
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // 创建节点类型菜单项
    const createNodeMenuItems = useMemo((): MenuProps['items'] => {
        return Object.entries(NodeDefineTypes)
            .filter(([_, nodeConfig]) => !nodeConfig.defaultConfig?.data.hidden)
            .map(([nodeType, nodeConfig]) => ({
                key: `node-${nodeType}`,
                label: nodeConfig.defaultConfig?.data.title,
                icon: <IconFont type={nodeConfig.icon} style={{fontSize: MENU_CONFIG.icon.size}}/>,
                onClick: () => {
                    onAddNode(nodeType);
                    onClose();
                },
            }));
    }, [onAddNode, onClose]);

    // 创建主菜单项
    const createMainMenuItems = useMemo((): MenuProps['items'] => {
        return [
            {
                key: 'add-node',
                label: '添加节点',
                icon: <IconFont type="icon-add" style={{fontSize: MENU_CONFIG.icon.size}}/>,
                children: createNodeMenuItems,
            },
            {
                key: 'add-comment',
                label: '添加注释',
                icon: <IconFont type="icon-file" style={{fontSize: MENU_CONFIG.icon.size}}/>,
                onClick: () => {
                    onAddComment();
                    onClose();
                },
            },
            {type: 'divider'},
            {
                key: 'export-dsl',
                label: '导出 DSL',
                icon: <IconFont type="icon-export" style={{fontSize: MENU_CONFIG.icon.size}}/>,
                onClick: () => {
                    onExportDSL();
                    onClose();
                },
            },
            {
                key: 'import-dsl',
                label: '导入 DSL',
                icon: <IconFont type="icon-import" style={{fontSize: MENU_CONFIG.icon.size}}/>,
                onClick: handleImportClick,
            },
        ];
    }, [createNodeMenuItems, onAddComment, onExportDSL, handleImportClick, onClose]);

    if (!visible) {
        return null;
    }

    return (
        <>
            {/* 背景遮罩 */}
            <div
                style={{
                    ...MENU_CONFIG.style.overlay,
                    zIndex: MENU_CONFIG.zIndex.overlay,
                }}
                onClick={onClose}
                onContextMenu={onContextMenu}
            />

            {/* 上下文菜单 */}
            <Menu
                items={createMainMenuItems}
                mode="vertical"
                selectable={false}
                style={{
                    ...MENU_CONFIG.style.menu,
                    left: position.x,
                    top: position.y,
                    zIndex: MENU_CONFIG.zIndex.menu,
                }}
            />

            {/* 隐藏的文件输入 */}
            <input
                ref={fileInputRef}
                type="file"
                accept={MENU_CONFIG.fileAccept}
                style={MENU_CONFIG.style.hiddenInput}
                onChange={handleFileChange}
            />
        </>
    );
};

export default ContextMenu;