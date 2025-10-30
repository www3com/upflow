import NodeWrapper from '@/pages/flow/components/NodeWrapper';
import { CodeNodeType, NodeType } from '@/types/flow/nodes';
import { Handle, Position } from '@xyflow/react';
import { memo } from 'react';

export default memo((node: NodeType<CodeNodeType>) => {
  return (
    <NodeWrapper node={node}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </NodeWrapper>
  );
});
