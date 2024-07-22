import { useEffect, useState, useRef } from "react";

export const useDebounceState = <T>(init: T) => {
  const [state, setState] = useState(init);
  const [debounceState, setDebounceState] = useState(init);

  // Use a ref to hold the timeout id to avoid creating a new one on every render
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear the previous timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to update the debounceState
    timeoutRef.current = setTimeout(() => {
      setDebounceState(state);
    }, 500);

    // Cleanup function to clear the timeout on component unmount or when `state` changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state]);

  return [state, setState, debounceState] as const;
};
