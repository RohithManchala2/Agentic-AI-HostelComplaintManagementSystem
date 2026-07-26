import { useEffect, useRef, useState } from "react";

/**
 * ---------------------------------------------------------
 * useDraggable Hook
 * ---------------------------------------------------------
 * Makes any component draggable.
 *
 * Returns:
 *  - dragRef
 *  - position
 *
 * Usage:
 *
 * const { dragRef, position } = useDraggable();
 *
 * <div
 *    ref={dragRef}
 *    style={{
 *       left: position.x,
 *       top: position.y
 *    }}
 * />
 * ---------------------------------------------------------
 */

const useDraggable = (
  initialX = window.innerWidth - 90,
  initialY = window.innerHeight - 100,
) => {
  const dragRef = useRef(null);

  const [position, setPosition] = useState({
    x: initialX,
    y: initialY,
  });

  const dragging = useRef(false);

  const offset = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const element = dragRef.current;

    if (!element) return;

    const handleMouseDown = (event) => {
      dragging.current = true;

      offset.current = {
        x: event.clientX - position.x,
        y: event.clientY - position.y,
      };

      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (event) => {
      if (!dragging.current) return;

      setPosition({
        x: event.clientX - offset.current.x,
        y: event.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => {
      dragging.current = false;

      document.body.style.userSelect = "auto";
    };

    element.addEventListener("mousedown", handleMouseDown);

    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);

      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [position]);

  return {
    dragRef,

    position,
  };
};

export default useDraggable;
