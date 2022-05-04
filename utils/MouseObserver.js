import React, { useState, useCallback, useEffect, createContext } from 'react';

export const MouseContext = createContext({
  mouseX: 0,
  mouseY: 0,
  dragging: false,
  offset: { x: 0, y: 0 },
  stateDraggable: {},
  zIndex: 0,
});

const MouseObserver = ({ children }) => {
  const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(0);
  const [draggable, setDraggable] = useState({});
  const [useTouch, setUseTouch] = useState(false);
  const [useMouse, setUseMouse] = useState(false);

  //collect mouse coordinates
  const handleMouseMove = useCallback((e) => {
    setMouseCoordinates({ x: e.clientX, y: e.clientY });
  }, []);

  //set the drag element in state and mouse position relative to element
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
      setZIndex((z) => z + 1);
      setDraggable(draggable);
      setDragging(true);
    }
  }, []);

  //reset state
  const handleMouseUp = useCallback(() => {
    console.log('mouseup');
    if (draggable?.style?.cursor) draggable.style.cursor = 'pointer';
    setOffset({ x: 0, y: 0 });
    setDraggable({});
    setDragging(false);
  }, [draggable]);

  //reset state
  const handleMouseLeave = useCallback(() => {
    console.log('mouseleave');
    if (draggable?.style?.cursor) draggable.style.cursor = 'pointer';
    setDraggable({});
    setDragging(false);
    setOffset({ x: 0, y: 0 });
  }, [draggable]);

  const handleMouseEnter = useCallback((e) => {}, []);

  const handleTouchStart = useCallback((e) => {
    console.log('touchstart');
    const draggable = e.target.parentNode;
    if (draggable?.dataset?.draggable) {
      const draggableRect = draggable.getBoundingClientRect();
      const { clientX: mouseX, clientY: mouseY } = e.touches[0];

      const offsetX = mouseX - draggableRect.left;
      const offsetY = mouseY - draggableRect.top;

      //set anchor position
      setZIndex((z) => z + 1);
      setDraggable(draggable);
      setOffset({ x: offsetX, y: offsetY });
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    console.log('touch moving');
    const { clientX, clientY } = e.touches[0];
    setMouseCoordinates({ x: clientX, y: clientY });
    setDragging(true);
  }, []);

  const handleTouchEnd = useCallback((e) => {
    console.log('touchend');
    setOffset({ x: 0, y: 0 });
    setDraggable({});
    setDragging(false);
  }, []);

  const handleTouchCancel = useCallback((e) => {
    console.log('touchcancel');
    setOffset({ x: 0, y: 0 });
    setDraggable({});
    setDragging(false);
  }, []);

  //set up event listeners
  useEffect(() => {
    if (matchMedia('(pointer:fine)').matches) setUseMouse(true);
    else setUseTouch(true);

    if (useMouse) {
      document.addEventListener('mousemove', handleMouseMove, {
        passive: true,
      });
      document.addEventListener('mouseup', handleMouseUp, {
        passive: true,
      });
      document.addEventListener('mousedown', handleMouseDown, {
        passive: true,
      });
      document.documentElement.addEventListener(
        'mouseleave',
        handleMouseLeave,
        {
          passive: true,
        }
      );
      document.documentElement.addEventListener(
        'mouseenter',
        handleMouseEnter,
        {
          passive: true,
        }
      );
    }
    if (useTouch) {
      document.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      document.addEventListener('touchend', handleTouchEnd, {
        passive: false,
      });
      document.addEventListener('touchcancel', handleTouchCancel, {
        passive: false,
      });
    }

    return () => {
      if (useMouse) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousedown', handleMouseDown);
        document.documentElement.removeEventListener(
          'mouseleave',
          handleMouseLeave
        );
        document.documentElement.removeEventListener(
          'mouseenter',
          handleMouseEnter
        );
      }
      if (useTouch) {
        document.documentElement.removeEventListener(
          'touchstart',
          handleTouchStart
        );
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('touchcancel', handleTouchCancel);
      }
    };
  }, [
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnter,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
    useMouse,
    useTouch,
  ]);

  return (
    <MouseContext.Provider
      value={{
        mouseX: mouseCoordinates.x,
        mouseY: mouseCoordinates.y,
        offset: { x: offset.x, y: offset.y },
        dragging: dragging,
        stateDraggable: draggable,
        zIndex,
      }}
    >
      {children}
    </MouseContext.Provider>
  );
};

export default MouseObserver;
