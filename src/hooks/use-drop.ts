import { useRef, useEffect, type DragEvent } from "react";

export function useDrop<T extends HTMLElement>(
  dataKey: string,
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onDrop: (data: string) => unknown | Promise<unknown>,
  onDragEnter?: (event: DragEvent<T>) => unknown,
  onDragLeave?: (event: DragEvent<T>) => unknown,
  isDroppable?: boolean,
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleDragOver = (event: DragEvent<T>) => {
      event.preventDefault();
    };

    const getDropData = (ev: DragEvent<T>) => ev.dataTransfer.getData(dataKey);

    const handleDrop = (event: DragEvent<T>) => {
      event.preventDefault();
      const droppedData = getDropData(event);
      if (droppedData) {
        void onDrop(droppedData);
      }
    };

    const getDragItemData = (event: DragEvent<T>) =>
      event.dataTransfer.types.includes(dataKey.toLowerCase());

    const handleDragEnter = (event: DragEvent<T>) => {
      const isDropping = getDragItemData(event);
      if (onDragEnter && isDropping) onDragEnter(event);
    };

    const handleDragLeave = (event: DragEvent<T>) => {
      const isDropping = getDragItemData(event);
      if (onDragLeave && isDropping) onDragLeave(event);
    };

    type EventFn = () => void;

    if (isDroppable === true || isDroppable === undefined) {
      element.addEventListener("dragover", handleDragOver as EventFn);
      element.addEventListener("drop", handleDrop as EventFn);
      element.addEventListener("dragenter", handleDragEnter as EventFn);
      element.addEventListener("dragleave", handleDragLeave as EventFn);
    }

    return () => {
      element.removeEventListener("dragover", handleDragOver as EventFn);
      element.removeEventListener("drop", handleDrop as EventFn);
      element.removeEventListener("dragenter", handleDragEnter as EventFn);
      element.removeEventListener("dragleave", handleDragLeave as EventFn);
    };
  }, [dataKey, onDrop, onDragEnter, onDragLeave, isDroppable]);

  return { ref: elementRef };
}
