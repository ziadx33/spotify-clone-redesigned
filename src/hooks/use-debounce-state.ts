import { useEffect, useState, useRef } from "react";

export const useDebounceState = <T>(init: T) => {
  const [state, setState] = useState(init);
  const [debounceState, setDebounceState] = useState(init);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebounceState(state);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state]);

  return [state, setState, debounceState] as const;
};
