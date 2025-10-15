import React, { useRef} from 'react';
import {  Menu } from 'antd';
import type { MenuProps } from 'antd';
import { NodeDefineTypes } from '@/pages/flow/nodeTypes';
import IconFont from '@/components/IconFont';

interface ContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
  onAddNode: (nodeType: string) => void;
  onAddComment: () => void;
  onExportDSL: () => void;
  onImportDSL: (file: File) => void;
}

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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportDSL(file);
      onClose();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 节点类型子菜单
  const nodeTypeMenuItems: MenuProps['items'] = Object.entries(NodeDefineTypes)
    .filter(([_, value]) =>  !value.defaultConfig?.data.hidden)
    .map(([key, config]) => ({
      key: `node-${key}`,
      label: config.defaultConfig?.data.title,
      icon: <IconFont type={config.icon} style={{ fontSize: 16 }} />,
      onClick: () => {
        onAddNode(key);
        onClose();
      },
    }));

  const menuItems: MenuProps['items'] = [
    {
      key: 'add-node',
      label: '添加节点',
      icon: <IconFont type="icon-add" style={{ fontSize: 16 }} />,
      children: nodeTypeMenuItems,
    },
    {
      key: 'add-comment',
      label: '添加注释',
      icon: <IconFont type="icon-file" style={{ fontSize: 16 }} />,
      onClick: () => {
        onAddComment();
        onClose();
      },
    },
    { type: 'divider' },
    {
      key: 'export-dsl',
      label: '导出 DSL',
      icon: <IconFont type="icon-export" style={{ fontSize: 16 }} />,
      onClick: () => {
        onExportDSL();
        onClose();
      },
    },
    {
      key: 'import-dsl',
      label: '导入 DSL',
      icon: <IconFont type="icon-import" style={{ fontSize: 16 }} />,
      onClick: handleImportClick,
    },
  ];

  if (!visible) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        onClick={onClose}
        onContextMenu={(e) => {
          // 在背景遮罩上右键时，更新菜单位置而不是关闭
          onContextMenu(e);
        }}
      />
      <Menu
        items={menuItems}
        mode="vertical"
        selectable={false}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          borderRadius: '6px',
        }}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".dsl"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ContextMenu;