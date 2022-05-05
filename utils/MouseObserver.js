import React, { useState, useCallback, useEffect, createContext } from "react";

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

    //collect mouse coordinates
    const handleMouseMove = useCallback((e) => {
        setMouseCoordinates({ x: e.clientX, y: e.clientY });
    }, []);

    //set the drag element in state and mouse position relative to element
    const handleMouseDown = useCallback((e) => {
        const draggable = e.target.parentNode;
        if (draggable?.dataset?.draggable) {
            const draggableRect = draggable.getBoundingClientRect();
            const { clientX: mouseX, clientY: mouseY } = e;

            const offsetX = mouseX - draggableRect.left;
            const offsetY = mouseY - draggableRect.top;

            setOffset({ x: offsetX, y: offsetY });
            setZIndex((z) => z + 1);
            setDraggable(draggable);
            setDragging(true);

            draggable.style.outline = "black dotted 2px";
            draggable.style.cursor = "move";
        }
    }, []);

    //reset state
    const handleMouseUp = useCallback(() => {
        if (draggable?.style?.cursor) draggable.style.cursor = "pointer";
        setOffset({ x: 0, y: 0 });
        setDragging(false);
    }, [draggable]);

    //reset state
    const handleMouseLeave = useCallback(() => {
        if (draggable?.style?.cursor) draggable.style.cursor = "pointer";
        setDragging(false);
        setOffset({ x: 0, y: 0 });
    }, [draggable]);

    //does nothing, just to have for now
    const handleMouseEnter = useCallback((e) => {}, []);

    //set drag element in state and push it to top layer
    const handleTouchStart = useCallback((e) => {
        const draggable = e.target.parentNode;
        if (draggable?.dataset?.draggable) {
            const draggableRect = draggable.getBoundingClientRect();
            const { clientX: mouseX, clientY: mouseY } = e.touches[0];

            const offsetX = mouseX - draggableRect.left;
            const offsetY = mouseY - draggableRect.top;

            //set anchor position
            setDraggable(draggable);
            setOffset({ x: offsetX, y: offsetY });
            setZIndex((z) => z + 1);

            draggable.style.outline = "black dotted 2px";
        }
    }, []);

    //set coordinates as touch moves
    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        const { clientX, clientY } = e.touches[0];
        setMouseCoordinates({ x: clientX, y: clientY });
        setDragging(true);
    }, []);

    //reset state
    const handleTouchEnd = useCallback((e) => {
        setOffset({ x: 0, y: 0 });
        // setDraggable({});
        setDragging(false);
    }, []);

    //reset state
    const handleTouchCancel = useCallback((e) => {
        setOffset({ x: 0, y: 0 });
        // setDraggable({});
        setDragging(false);
    }, []);

    //sets up event listeners
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
            {
                passive: true,
            }
        );
        document.documentElement.addEventListener(
            "mouseenter",
            handleMouseEnter,
            {
                passive: true,
            }
        );

        document.addEventListener("touchstart", handleTouchStart, {
            passive: true,
        });
        document.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        document.addEventListener("touchend", handleTouchEnd, {
            passive: false,
        });
        document.addEventListener("touchcancel", handleTouchCancel, {
            passive: false,
        });

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousedown", handleMouseDown);
            document.documentElement.removeEventListener(
                "mouseleave",
                handleMouseLeave
            );
            document.documentElement.removeEventListener(
                "mouseenter",
                handleMouseEnter
            );

            document.documentElement.removeEventListener(
                "touchstart",
                handleTouchStart
            );
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
            document.removeEventListener("touchcancel", handleTouchCancel);
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
