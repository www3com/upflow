import NodeWrapper from '@/pages/flow/components/NodeWrapper';
import { EndNodeType, NodeType } from '@/types/flow';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: NodeType<EndNodeType>) => {
  return (
    <NodeWrapper node={node}>
      <Handle type="target" position={Position.Left} />
    </NodeWrapper>
  );
});
