import GroupNodeWrapper from '@/pages/flow/flow-canvas/components/group-node-wrapper';
import { NodeType, SqlTransactionNodeType } from '@/types/flow/nodes';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: NodeType<SqlTransactionNodeType>) => {
  return (
    <GroupNodeWrapper node={node}>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </GroupNodeWrapper>
  );
});
