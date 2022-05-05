import React, { useEffect, useState, useCallback } from "react";
import Draggable from "./Draggable";

const dragStartingCoordinates = [
    { top: 43, left: 26 },
    { top: 12, left: 12 },
    { top: 68, left: 56 },
];

const DragArea = () => {
    return (
        <div className="absolute top-0 left-0 bottom-[90px] right-[90px]">
            {dragStartingCoordinates.map((coords, i) => (
                <Draggable uid={i} key={i} coords={coords} />
            ))}
        </div>
    );
};

export default DragArea;
