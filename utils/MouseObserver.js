import React, { useState, useCallback, useEffect, createContext } from "react";

export const MouseContext = createContext({
    top: 0,
    left: 0,
    dragging: false,
});

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const MouseObserver = ({ children }) => {
    const [dragCoordinates, setDragCoordinates] = useState({ top: 0, left: 0 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [draggable, setDraggable] = useState({});

    const handleMouseMove = useCallback(
        (e) => {
            if (draggable?.dataset?.draggable) {
                //produces rectangle representing element
                draggable.style.cursor = "pointer";
                const dragArea = draggable.parentNode;
                const dragAreaRect = dragArea.getBoundingClientRect();

                //get mouse position on visible part of page
                const { clientX: mouseX, clientY: mouseY } = e;

                //coordinates from where the element is moved
                const anchorX = mouseX - offset.x;
                const anchorY = mouseY - offset.y;

                //move percents based on 0,0 of draggable element coordinates

                const relativePos = {
                    top: clamp((anchorY / dragAreaRect.height) * 100, 0, 100),
                    left: clamp((anchorX / dragAreaRect.width) * 100, 0, 100),
                };
                if (dragging) {
                    draggable.style.cursor = "move";
                    setDragCoordinates(relativePos);
                }
            }
        },
        [dragging, offset, draggable]
    );

    const handleMouseDown = useCallback((e) => {
        const draggable = e.target.parentNode;
        if (draggable?.dataset?.draggable) {
            const draggableRect = draggable.getBoundingClientRect();
            const { clientX: mouseX, clientY: mouseY } = e;
            const offsetX = mouseX - draggableRect.left;
            const offsetY = mouseY - draggableRect.top;

            //set anchor position
            const offset = { x: offsetX, y: offsetY };
            draggable.style.cursor = "move";

            setOffset(offset);
            setDraggable(draggable);
            setDragging(true);
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        if (draggable?.style?.cursor) draggable.style.cursor = "pointer";
        setOffset({ x: 0, y: 0 });
        setDraggable({});
        setDragging(false);
    }, [draggable]);

    const handleMouseLeave = useCallback(() => {
        if (draggable?.style?.cursor) draggable.style.cursor = "pointer";
        setDraggable({});
        setDragging(false);
        setOffset({ x: 0, y: 0 });
    }, [draggable]);

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove, {
            passive: true,
        });
        document.addEventListener("mouseup", handleMouseUp, {
            passive: true,
        });
        document.addEventListener("mousedown", handleMouseDown, {
            passive: true,
        });
        document.documentElement.addEventListener(
            "mouseleave",
            handleMouseLeave,
            { passive: true }
        );

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave]);

    return (
        <MouseContext.Provider
            value={{
                top: dragCoordinates.top,
                left: dragCoordinates.left,
            }}
        >
            {children}
        </MouseContext.Provider>
    );
};

export default MouseObserver;
