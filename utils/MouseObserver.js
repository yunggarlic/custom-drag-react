import React, { useState, useCallback, useEffect, createContext } from 'react';

export const MouseContext = createContext({
  mouseX: 0,
  mouseY: 0,
  dragging: false,
  offset: { x: 0, y: 0 },
  stateDraggable: {},
});

const MouseObserver = ({ children }) => {
  const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [draggable, setDraggable] = useState({});

  const handleMouseMove = useCallback((e) => {
    setMouseCoordinates({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseDown = useCallback((e) => {
    const draggable = e.target.parentNode;
    if (draggable?.dataset?.draggable) {
      draggable.style.cursor = 'move';
      const draggableRect = draggable.getBoundingClientRect();
      const { clientX: mouseX, clientY: mouseY } = e;

      const offsetX = mouseX - draggableRect.left;
      const offsetY = mouseY - draggableRect.top;

      //set anchor position
      setOffset({ x: offsetX, y: offsetY });
      setDraggable(draggable);
      setDragging(true);
    }
  }, []);

  //reset state
  const handleMouseUp = useCallback(() => {
    if (draggable?.style?.cursor) draggable.style.cursor = 'pointer';
    setOffset({ x: 0, y: 0 });
    setDraggable({});
    setDragging(false);
  }, [draggable]);

  //reset state
  const handleMouseLeave = useCallback(() => {
    if (draggable?.style?.cursor) draggable.style.cursor = 'pointer';
    setDraggable({});
    setDragging(false);
    setOffset({ x: 0, y: 0 });
  }, [draggable]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    });
    document.addEventListener('mouseup', handleMouseUp, {
      passive: true,
    });
    document.addEventListener('mousedown', handleMouseDown, {
      passive: true,
    });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave, {
      passive: true,
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave]);

  return (
    <MouseContext.Provider
      value={{
        mouseX: mouseCoordinates.x,
        mouseY: mouseCoordinates.y,
        offset: { x: offset.x, y: offset.y },
        dragging: dragging,
        stateDraggable: draggable,
      }}
    >
      {children}
    </MouseContext.Provider>
  );
};

export default MouseObserver;
