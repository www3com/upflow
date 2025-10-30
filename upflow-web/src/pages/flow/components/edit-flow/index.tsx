import AttributePanel from '@/pages/flow/components/AttributePanel';
import ContextMenu from '@/pages/flow/components/ContextMenu';
import NodePanel from '@/pages/flow/components/NodePanel';
import { useFlow } from '@/pages/flow/hooks/useFlow';
import { NODE_TYPE, NodeDefineTypes } from '@/pages/flow/nodeTypes';
import { addNode, editFlowState, fetchFlow, saveFlow } from '@/stores/flow/edit-flow';
import {
  Background,
  BackgroundVariant,
  Edge,
  Node,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Space, Splitter } from 'antd';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';
import '../../xy-theme.css';
import ZoomControl from '../ZoomControl';

interface EditFlowProps {
  flowId?: string;
  onSave?: () => void;
  onCancel?: () => void;
  open: boolean;
}

const EditFlow: React.FC<EditFlowProps> = memo((props) => {
  const { open, flowId, onSave, onCancel } = props;
  const [loaded, setLoaded] = useState(false);
  console.log('EditFlow props', props);

  const handleClose = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  useEffect(() => {
    if (open && flowId) {
      setLoaded(false);
      fetchFlow(flowId).then(() => {
        setLoaded(true);
      });
    } else if (!open) {
      setLoaded(false);
    }
  }, [open, flowId]);
  // 全屏遮罩样式
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    display: 'none',
  };
  // 只有在数据加载完成后才渲染 ReactFlow 组件
  if (!open || !loaded) {
    return <div style={overlayStyle} />;
  }

  return (
    <ReactFlowProvider>
      <EditFlowContent {...props} visible={open} onClose={handleClose} />
    </ReactFlowProvider>
  );
});

const EditFlowContent: React.FC<EditFlowProps & { visible: boolean; onClose: () => void }> = memo(
  ({ onSave, onCancel, visible, onClose }) => {
    const [contextMenu, setContextMenu] = useState({
      visible: false,
      position: { x: 0, y: 0 },
    });

    const { screenToFlowPosition } = useReactFlow();

    const snap = useSnapshot(editFlowState);
    const {
      onNodesChange,
      onEdgesChange,
      onConnect,
      onDrop,
      onDragOver,
      onNodeDrag,
      onNodeDragStop,
      onNodeMouseEnter,
      onNodeMouseLeave,
      onValidConnection,
      dropNodeIds,
      hoveredNodeId,
    } = useFlow();

    const nodeTypes = useMemo(() => {
      return Object.fromEntries(Object.entries(NodeDefineTypes).map(([key, value]) => [key, value.renderComponent]));
    }, []);

    const handleContextMenu = useCallback((event: React.MouseEvent) => {
      event.preventDefault();
      setContextMenu({ visible: true, position: { x: event.clientX, y: event.clientY } });
    }, []);

    const handleCloseContextMenu = useCallback(() => {
      setContextMenu({ visible: false, position: { x: 0, y: 0 } });
    }, []);

    const handleAddNode = useCallback(
      (nodeType: string) => {
        const flowPosition = screenToFlowPosition(contextMenu.position);
        addNode(nodeType, flowPosition);
      },
      [screenToFlowPosition, contextMenu.position],
    );

    const handleAddComment = useCallback(() => {
      const position = screenToFlowPosition(contextMenu.position);
      addNode(NODE_TYPE.NOTE, position);
    }, [screenToFlowPosition, contextMenu.position]);

    const handleSave = useCallback(() => {
      saveFlow();
      onSave?.();
    }, [onSave]);

    const handleCancel = useCallback(() => {
      onClose();
      onCancel?.();
    }, [onClose, onCancel]);

    if (!visible) {
      return null;
    }
    console.log('EditFlow', snap.nodes);
    const overlayStyle: React.CSSProperties = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#fff',
      zIndex: 1000,
      display: visible ? 'block' : 'none',
    };

    return (
      <div style={overlayStyle}>
        <Splitter style={{ height: '100vh' }}>
          <Splitter.Panel
            defaultSize="160"
            min="5%"
            max="20%"
            collapsible={{ start: false, end: true, showCollapsibleIcon: 'auto' }}
          >
            <NodePanel />
          </Splitter.Panel>
          <Splitter.Panel>
            <ReactFlow
              proOptions={{ hideAttribution: true }}
              nodeTypes={nodeTypes}
              minZoom={0.25}
              maxZoom={2}
              nodes={snap.nodes.map(
                (node: any) =>
                  ({
                    ...node,
                    className: `${node.className} ${dropNodeIds?.includes(node.id) && 'highlight'} ${
                      hoveredNodeId === node.id && 'node-hovered'
                    }`,
                  } as Node),
              )}
              edges={snap.edges.map(
                (edge: any) =>
                  ({
                    ...edge,
                    className: `${edge.className} ${
                      hoveredNodeId && (edge.source === hoveredNodeId || edge.target === hoveredNodeId) && 'edge-hovered'
                    }`,
                  } as Edge),
              )}
              onNodeDrag={onNodeDrag}
              onNodeDragStop={onNodeDragStop}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              isValidConnection={onValidConnection}
              selectionMode={SelectionMode.Partial}
              selectNodesOnDrag={false}
              onContextMenu={handleContextMenu}
            >
              <Panel position="top-right">
                <Space>
                  <Button onClick={saveFlow} color="primary" variant="outlined">
                    运行
                  </Button>
                  <Button type="primary" onClick={handleSave}>
                    保存
                  </Button>
                  <Button onClick={handleCancel}>返回</Button>
                </Space>
              </Panel>
              <AttributePanel />
              <ZoomControl />
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
            <ContextMenu
              visible={contextMenu.visible}
              position={contextMenu.position}
              onClose={handleCloseContextMenu}
              onContextMenu={handleContextMenu}
              onAddNode={handleAddNode}
              onAddComment={handleAddComment}
              // onExportDSL={exportDSL}
              // onImportDSL={importDSL}
            />
          </Splitter.Panel>
        </Splitter>
      </div>
    );
  },
);

export default EditFlow;
