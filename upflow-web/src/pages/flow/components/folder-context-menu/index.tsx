import { ConfigProvider, Menu, type MenuProps, theme } from 'antd';
import { AppstoreAddOutlined, FolderAddOutlined, EditOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import styles from './styles.less';

// 菜单项定义
const items: MenuProps['items'] = [
  {
    label: '新建应用',
    key: 'new-app',
    icon: <AppstoreAddOutlined />,
  },
  {
    label: '新建文件夹',
    key: 'new-folder',
    icon: <FolderAddOutlined />,
  },
  { type: 'divider' },
  {
    label: '重命名',
    key: 'rename',
    icon: <EditOutlined />,
  },
  {
    label: '移动',
    key: 'move',
    icon: <DragOutlined />,
  },
  {
    label: '删除',
    key: 'delete',
    icon: <DeleteOutlined />,
  },
];

// 右键菜单组件（受控显示与定位）
interface FolderContextMenuProps {
  visible?: boolean;
  position?: { x: number; y: number };
  nodeKey?: React.Key;
  onClose?: () => void;
  onMenuClick?: (key: string, nodeKey?: React.Key) => void;
}

const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  visible = false,
  position = { x: 0, y: 0 },
  nodeKey,
  onClose,
  onMenuClick,
}) => {
  useEffect(() => {
    if (!visible) return;

    const handleGlobalClick = () => onClose?.();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };

    // 使用 click 和 Escape 关闭，避免在右键触发时立即被关闭
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const style: React.CSSProperties = {
    position: 'fixed',
    top: position.y,
    left: position.x,
    zIndex: 10000,
    background: '#fff',
    boxShadow: '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
    borderRadius: 8,
    overflow: 'hidden',
  };

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    onMenuClick?.(String(key), nodeKey);
    onClose?.();
  };

  return (
    <div style={style} onContextMenu={(e) => e.preventDefault()}>
      <ConfigProvider
        theme={{
          algorithm: theme.compactAlgorithm,
          components: {
            Menu: {
              itemHeight: 28,
              itemPaddingInline: 12,
              itemMarginBlock: 4,
              iconSize: 14,
            },
          },
        }}
      >
        <Menu rootClassName={styles.menu} selectable={false} items={items} onClick={handleClick} />
      </ConfigProvider>
    </div>
  );
};

export default FolderContextMenu;
