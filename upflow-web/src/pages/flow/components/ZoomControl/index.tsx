import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Panel, useKeyPress, useReactFlow } from '@xyflow/react';
import { FullscreenOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Flex, MenuProps } from 'antd';
import styles from './index.less';

const ZOOM_LEVELS: MenuProps['items'] = [
  { key: '2', label: '200%', extra: '⌘ 2' },
  { key: '1', label: '100%', extra: '⌘ 1' },
  { key: '0.75', label: '75%' },
  { key: '0.5', label: '50%', extra: '⌘ 5' },
  { key: '0.25', label: '25%' },
];

const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const ZoomControl = () => {
  const { zoomIn, zoomOut, fitView, getZoom, zoomTo } = useReactFlow();
  const [zoom, setZoom] = useState(getZoom);

  const updateZoom = useCallback(() => {
    setTimeout(() => setZoom(getZoom()), 250);
  }, [getZoom]);

  const handleZoomAction = useCallback(
    (action: () => void) => {
      action();
      updateZoom();
    },
    [updateZoom],
  );

  const onZoomIn = useCallback(() => handleZoomAction(() => zoomIn({ duration: 200 })), [handleZoomAction, zoomIn]);
  const onZoomOut = useCallback(() => handleZoomAction(() => zoomOut({ duration: 200 })), [handleZoomAction, zoomOut]);
  const onFitView = useCallback(() => handleZoomAction(() => fitView({ duration: 200 })), [handleZoomAction, fitView]);
  const onZoomTo = useCallback((level: number) => handleZoomAction(() => zoomTo(level, { duration: 200 })), [handleZoomAction, zoomTo]);

  const handleMenuClick: MenuProps['onClick'] = useCallback(
    ({ key }: { key: string }) => {
      onZoomTo(parseFloat(key));
    },
    [onZoomTo],
  );

  const cmd1Pressed = useKeyPress(['Meta+1', 'Ctrl+1']);
  const cmd2Pressed = useKeyPress(['Meta+2', 'Ctrl+2']);
  const cmd5Pressed = useKeyPress(['Meta+5', 'Ctrl+5']);

  const prevCmd1Pressed = usePrevious(cmd1Pressed);
  const prevCmd2Pressed = usePrevious(cmd2Pressed);
  const prevCmd5Pressed = usePrevious(cmd5Pressed);

  useEffect(() => {
    if (!prevCmd1Pressed && cmd1Pressed) {
      onZoomTo(1);
    }
  }, [prevCmd1Pressed, cmd1Pressed, onZoomTo]);

  useEffect(() => {
    if (!prevCmd2Pressed && cmd2Pressed) {
      onZoomTo(2);
    }
  }, [prevCmd2Pressed, cmd2Pressed, onZoomTo]);

  useEffect(() => {
    if (!prevCmd5Pressed && cmd5Pressed) {
      onZoomTo(0.5);
    }
  }, [prevCmd5Pressed, cmd5Pressed, onZoomTo]);

  return (
    <Panel position="bottom-left">
      <Flex className={styles.panel}>
        <Flex align="center">
          <Button type="text" icon={<ZoomInOutlined />} onClick={onZoomIn} />
          <Dropdown menu={{ items: ZOOM_LEVELS, onClick: handleMenuClick }}>
            <span className={styles.zoomDisplay}>{`${(zoom * 100).toFixed(0)}%`}</span>
          </Dropdown>
          <Button type="text" icon={<ZoomOutOutlined />} onClick={onZoomOut} />
        </Flex>
        <Divider type="vertical" />
        <Button type="text" icon={<FullscreenOutlined />} onClick={onFitView} />
      </Flex>
    </Panel>
  );
};

export default memo(ZoomControl);
