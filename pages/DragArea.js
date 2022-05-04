import React, { useEffect, useState, useCallback } from 'react';
import Draggable from './Draggable';

const DragArea = () => {
  return (
    <div className="absolute top-0 left-0 bottom-[90px] right-[90px]">
      <Draggable uid={1} />
      <Draggable uid={2} />
      <Draggable uid={3} />
    </div>
  );
};

export default DragArea;
