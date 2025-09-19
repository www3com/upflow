import React, { useState, useRef, useCallback, ReactNode } from 'react';
import styles from './styles.less';

interface ResizablePanelProps {
  children: ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  isMaximized?: boolean;
}

export default function Index({
  children,
  defaultWidth = 400,
  minWidth = 200,
  maxWidth = 1200,
  className = '',
  style = {},
  isMaximized = false
}: ResizablePanelProps) {
  const [panelWidth, setPanelWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        const newWidth = rect.right - e.clientX;
        const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        setPanelWidth(clampedWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [minWidth, maxWidth]);

  return (
    <div
      ref={panelRef}
      className={`${styles.resizablePanel} ${className}`}
      style={{ ...style, ...(isMaximized ? {} : { width: panelWidth }) }}
    >
      <div
        className={`${styles.resizeHandle} ${isDragging ? styles.resizeHandleActive : ''}`}
        onMouseDown={handleMouseDown}
      />
      {children}
    </div>
  );
}