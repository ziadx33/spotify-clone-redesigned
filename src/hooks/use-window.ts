import { useState, useEffect } from "react";

export function useWindow() {
  type WindowStateType = {
    width?: number;
    height?: number;
  };
  const [windowSize, setWindowSize] = useState<WindowStateType>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);

      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
}
