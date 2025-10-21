import React, { useState, useMemo } from 'react';
import { Card, Flex } from 'antd';
import { NodeDefineTypes } from '@/pages/flow/nodeTypes';
import DraggableNodeItem from './DraggableNodeItem';
import styles from './styles.less';

// 常量定义
const FLEX_GAP = 4;

/**
 * 节点面板组件
 * 显示可拖拽的节点类型列表
 */
const NodePanel: React.FC = () => {
  const [hoveredNodeType, setHoveredNodeType] = useState<string | null>(null);

  // 过滤可见的节点类型
  const visibleNodeTypes = useMemo(() => {
    return Object.entries(NodeDefineTypes).filter(
      ([, nodeConfig]) => !nodeConfig.defaultConfig?.data.hidden
    );
  }, []);

  return (
    <Card 
      title="组件面板" 
      variant="borderless" 
      size="small" 
      className={styles.card}
    >
      <Flex wrap gap={FLEX_GAP}>
        {visibleNodeTypes.map(([nodeType, nodeConfig]) => (
          <DraggableNodeItem
            key={nodeType}
            nodeType={nodeType}
            nodeConfig={nodeConfig}
            isHovered={hoveredNodeType === nodeType}
            onMouseEnter={() => setHoveredNodeType(nodeType)}
            onMouseLeave={() => setHoveredNodeType(null)}
          />
        ))}
      </Flex>
    </Card>
  );
};

export default NodePanel;