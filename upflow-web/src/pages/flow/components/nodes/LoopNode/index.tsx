import GroupNodeWrapper from '@/pages/flow/components/GroupNodeWrapper';
import { LoopNodeType, NodeType } from '@/types/flow/nodes';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: NodeType<LoopNodeType>) => {
  return (
    <GroupNodeWrapper node={node}>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </GroupNodeWrapper>
  );
});
