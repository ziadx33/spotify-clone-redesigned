import { useEffect, useRef } from "react";

export function useDrag<T extends HTMLElement>(
  dragId: string,
  value: string,
  dragImage?: Element | null,
  controller?: boolean,
) {
  const refs = useRef<T[]>([]);

  useEffect(() => {
    refs.current.forEach((element) => {
      if (!element) return;

      const handleDragStart = (e: DragEvent) => {
        e.dataTransfer?.setData(dragId, value);
        if (dragImage) e.dataTransfer?.setDragImage(dragImage, 0, 0);
      };

      if (dragImage !== null)
        element.addEventListener("dragstart", handleDragStart);
      if (controller !== undefined) {
        element.draggable = controller;
      }

      return () => {
        element.removeEventListener("dragstart", handleDragStart);
      };
    });
  }, [dragId, value, controller, dragImage]);

  const addRef = (el: T | null) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };

  return { addRef };
}
