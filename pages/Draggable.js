import React, { useEffect, useRef, useState, useContext } from 'react';
import { MouseContext } from '../utils/MouseObserver';

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const Draggable = (props) => {
  const draggable = useRef(null);
  const [dragCoordinates, setDragCoordinates] = useState({ top: 0, left: 0 });
  const { mouseX, mouseY, dragging, offset, stateDraggable } =
    useContext(MouseContext);

  useEffect(() => {
    const dragArea = draggable.current.parentNode;
    const dragAreaRect = dragArea.getBoundingClientRect();
    const { uid: thisUid } = draggable.current.dataset;
    if (dragging && thisUid === stateDraggable?.dataset?.uid) {
      const anchorX = mouseX - offset.x;
      const anchorY = mouseY - offset.y;
      const relativePos = {
        top: clamp((anchorY / dragAreaRect.height) * 100, 0, 100),
        left: clamp((anchorX / dragAreaRect.width) * 100, 0, 100),
      };

      console.log(relativePos);

      setDragCoordinates(relativePos);
    }
  }, [mouseX, mouseY, offset, dragging, stateDraggable]);

  return (
    <a
      ref={draggable}
      data-uid={props.uid}
      draggable="false"
      data-draggable={true}
      className="absolute text-sm flex flex-col items-center pointer-events-none w-[90px]"
      style={{
        top: `${dragCoordinates.top}%`,
        left: `${dragCoordinates.left}%`,
      }}
    >
      <img
        draggable="false"
        alt="kronk"
        src="/kronk.jpg"
        width="90"
        height="90"
        className="rendering-pixelated pointer-events-auto"
      />
      <span className="w-full pointer-events-auto text-center bg-white">
        Hello there
      </span>
    </a>
  );
};

export default Draggable;
