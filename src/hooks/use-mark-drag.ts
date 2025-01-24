import {
  type Dispatch,
  type SetStateAction,
  type RefObject,
  useEffect,
} from "react";

export function useMarkerDrag(
  fileDuration: number,
  startMarker: number,
  endMarker: number,
  setStartMarker: React.Dispatch<React.SetStateAction<number>>,
  setEndMarker: React.Dispatch<React.SetStateAction<number>>,
  canvasRef: RefObject<HTMLCanvasElement>,
  isDraggingStart: boolean,
  isDraggingEnd: boolean,
  setIsDraggingStart: Dispatch<SetStateAction<boolean>>,
  setIsDraggingEnd: Dispatch<SetStateAction<boolean>>,
) {
  const MIN_SELECTION_DURATION = 5;
  const MAX_SELECTION_DURATION = 15;

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingStart || isDraggingEnd) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const canvasWidth = canvas.offsetWidth;
      const newTime = (mouseX / canvasWidth) * fileDuration;

      if (isDraggingStart) {
        const newStart = Math.max(
          0,
          Math.min(newTime, endMarker - MIN_SELECTION_DURATION),
        );
        setStartMarker(newStart);

        if (endMarker - newStart > MAX_SELECTION_DURATION) {
          setEndMarker(newStart + MAX_SELECTION_DURATION);
        }
      }

      if (isDraggingEnd) {
        const newEnd = Math.min(
          fileDuration,
          Math.max(newTime, startMarker + MIN_SELECTION_DURATION),
        );
        setEndMarker(newEnd);

        if (newEnd - startMarker > MAX_SELECTION_DURATION) {
          setStartMarker(newEnd - MAX_SELECTION_DURATION);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraggingStart, isDraggingEnd, startMarker, endMarker]);

  return {
    isDraggingStart,
    setIsDraggingStart,
    isDraggingEnd,
    setIsDraggingEnd,
    handleMouseMove,
    handleMouseUp,
  };
}
