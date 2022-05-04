import React, { useEffect, useRef, useState, useContext } from "react";
import { MouseContext } from "../utils/MouseObserver";

const Draggable = (props) => {
    const { top, left, bottom, right, offsetX, offsetY, dragging } =
        useContext(MouseContext);
    return (
        <a
            data-uid={props.uid}
            draggable="false"
            data-draggable={true}
            className="absolute text-sm flex flex-col items-center pointer-events-none w-[90px]"
            style={{
                top: `${top}%`,
                left: `${left}%`,
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
