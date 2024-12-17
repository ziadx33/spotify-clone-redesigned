import { useState, useEffect } from "react";

export function useWindow() {
  type WindowStateType = {
    width?: number;
    height?: number;
  };
  const container =
    document.querySelector<HTMLDivElement>("#content-container");
  const [windowSize, setWindowSize] = useState<WindowStateType>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (typeof container !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: container?.clientWidth,
          height: container?.clientHeight,
        });
      };

      container?.addEventListener("resize", handleResize);

      handleResize();
      return () => container?.removeEventListener("resize", handleResize);
    }
  }, [container]);

  return windowSize;
}
