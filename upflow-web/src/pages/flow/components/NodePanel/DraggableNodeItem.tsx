import React, { DragEvent, memo } from 'react';
import { Flex } from 'antd';
import IconFont from '@/components/IconFont';
import { NodeDefineType } from '@/types/flow';
import styles from './styles.less';

// 常量定义
const DRAG_DATA_TYPE = 'application/reactflow';
const DRAG_EFFECT = 'move';
const ICON_GAP = 5;

interface DraggableNodeItemProps {
  /** 节点类型标识 */
  nodeType: string;
  /** 节点配置 */
  nodeConfig: NodeDefineType;
  /** 是否处于悬停状态 */
  isHovered: boolean;
  /** 鼠标进入事件 */
  onMouseEnter: () => void;
  /** 鼠标离开事件 */
  onMouseLeave: () => void;
}

/**
 * 可拖拽节点项组件
 * 用于显示单个可拖拽的节点类型
 */
const DraggableNodeItem: React.FC<DraggableNodeItemProps> = memo(({
  nodeType,
  nodeConfig,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => {
  // 拖拽开始事件处理
  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer.setData(DRAG_DATA_TYPE, nodeType);
    event.dataTransfer.effectAllowed = DRAG_EFFECT;
  };

  return (
    <Flex
      vertical
      draggable
      align="center"
      justify="center"
      gap={ICON_GAP}
      className={`${styles.draggableNode} ${isHovered ? styles.draggableNodeHovered : ''}`}
      onDragStart={handleDragStart}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <IconFont
        type={nodeConfig.icon}
        className={styles.nodeIcon}
      />
      <span className={styles.nodeTitle}>
        {nodeConfig.defaultConfig?.data.title}
      </span>
    </Flex>
  );
});

DraggableNodeItem.displayName = 'DraggableNodeItem';

export default DraggableNodeItem;