import NodeWrapper from '@/pages/flow/components/node-wrapper';
import { NodeType } from '@/types/flow/nodes';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: NodeType<any>) => {
  return (
    <NodeWrapper node={node}>
      <Handle type="target" position={Position.Left} />
    </NodeWrapper>
  );
});
