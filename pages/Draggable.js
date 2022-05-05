import React, { useEffect, useRef, useState, useContext } from "react";
import { MouseContext } from "../utils/MouseObserver";
import { useLocalStorage } from "../utils/useLocalStorage";
import Image from "next/image";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const Draggable = ({ coords, uid }) => {
    const [loaded, setLoaded] = useState(false);
    const draggable = useRef(null);
    // const [dragCoordinates, setDragCoordinates] = useLocalStorage(uid, {
    //     top: 0,
    //     left: 0,
    // });
    const [dragCoordinates, setDragCoordinates] = useState({ top: 0, left: 0 });
    const [localZIndex, setLocalZIndex] = useState(0);
    const { mouseX, mouseY, dragging, offset, stateDraggable, zIndex } =
        useContext(MouseContext);

    //handles dragging
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
                localStorage[`tf${uid}`] = JSON.stringify(relativePos);
            }
        } else {
            draggable.current.style.outline = "none";
        }
    }, [mouseX, mouseY, offset, dragging, stateDraggable, zIndex, uid]);

    //load coordinates from localStorage
    useEffect(() => {
        if (localStorage[`tf${uid}`]) {
            setDragCoordinates(JSON.parse(localStorage[`tf${uid}`]));
        } else {
            localStorage[`tf${uid}`] = JSON.stringify(coords);
            setDragCoordinates(coords);
        }
    }, [coords, uid]);

    return (
        <a
            ref={draggable}
            data-uid={uid}
            draggable="false"
            data-draggable={true}
            className="absolute text-sm flex flex-col items-center pointer-events-none w-[90px]"
            style={{
                top: `${dragCoordinates?.top}%`,
                left: `${dragCoordinates?.left}%`,
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
