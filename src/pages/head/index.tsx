import { Layout } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import './index.less';

const Head = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const isDragging = useRef(false);
  const initialPos = useRef({ offsetX: 0, offsetY: 0 });
  const parentRef = useRef<HTMLDivElement>(null); // 父容器引用
  const ELEMENT_WIDTH = 96;
  const ELEMENT_HEIGHT = 64;
  const BORDER_WIDTH = 1;
  const GRID_SIZE = 16;

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !parentRef.current) return;

    const parentRect = parentRef.current.getBoundingClientRect();

    // 计算原始位置
    const rawX = e.clientX - parentRect.left - initialPos.current.offsetX;
    const rawY = e.clientY - parentRect.top - initialPos.current.offsetY;

    // 边界约束
    const maxX = parentRect.width - ELEMENT_WIDTH;
    const maxY = parentRect.height - ELEMENT_HEIGHT;
    const clampedX = Math.max(0, Math.min(maxX, rawX));
    const clampedY = Math.max(0, Math.min(maxY, rawY));

    // 栅格吸附
    const snappedX = Math.round(clampedX / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(clampedY / GRID_SIZE) * GRID_SIZE;

    // 边缘对齐补偿
    const finalX = snappedX >= maxX - BORDER_WIDTH ? snappedX - BORDER_WIDTH : snappedX;
    const finalY = snappedY >= maxY - BORDER_WIDTH ? snappedY - BORDER_WIDTH : snappedY;

    setPosition({
      x: finalX,
      y: finalY
    });
  }, []);

  // 处理鼠标释放
  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDragging(false); // 新增状态变量触发渲染

    // 强制移除拖拽类名（保险机制）
    parentRef.current?.classList.remove('dragging');
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  // 处理鼠标按下
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isDragging.current = true;
      setDragging(true);

      // 计算初始偏移量
      const rect = e.currentTarget.getBoundingClientRect();
      initialPos.current = {
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      };

      // 添加事件监听
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  // 组件卸载时清除监听
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      handleMouseUp();
    };

    window.addEventListener('mouseup', handleMouseUpGlobal);

    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [handleMouseUp]);

  return (
    <Layout rootClassName={`head ${dragging ? 'show-grid' : ''}`} ref={parentRef}>
      <div
        className='h-main'
        style={{
          left: position.x,
          top: position.y,
          cursor: isDragging.current ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        HEAD
      </div>
    </Layout>
  );
};
export default Head;
