import React, { useEffect, useRef, useState, useContext } from "react";
import { MouseContext } from "../utils/MouseObserver";
import Image from "next/image";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const Draggable = (props) => {
    const draggable = useRef(null);
    const [dragCoordinates, setDragCoordinates] = useState({
        top: 0,
        left: 0,
    });
    const [localZIndex, setLocalZIndex] = useState(0);
    const { mouseX, mouseY, dragging, offset, stateDraggable, zIndex } =
        useContext(MouseContext);

    useEffect(() => {
        const dragArea = draggable.current.parentNode;
        const dragAreaRect = dragArea.getBoundingClientRect();
        const { uid: thisUid } = draggable.current.dataset;
        if (thisUid === stateDraggable?.dataset?.uid) {
            setLocalZIndex(zIndex);
            if (dragging) {
                const anchorX = mouseX - offset.x;
                const anchorY = mouseY - offset.y;

                const relativePos = {
                    top: clamp((anchorY / dragAreaRect.height) * 100, 0, 100),
                    left: clamp((anchorX / dragAreaRect.width) * 100, 0, 100),
                };
                draggable.current.style.outline = "black dotted 2px";

                setDragCoordinates(relativePos);
            }
        } else {
            draggable.current.style.outline = "none";
        }
    }, [mouseX, mouseY, offset, dragging, stateDraggable, zIndex]);

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
                zIndex: `${localZIndex}`,
            }}
        >
            <img
                draggable="false"
                alt="kronk"
                src="/kronk.jpg"
                width="90"
                height="90"
                className="p-2 rendering-pixelated pointer-events-auto"
            />
            <span className="w-full pointer-events-auto text-center bg-white">
                Hello there
            </span>
        </a>
    );
};

export default Draggable;
