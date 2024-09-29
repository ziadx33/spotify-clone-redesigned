import { type ChangeValueParam } from "@/types";
import { getChangeValue } from "@/utils/get-change-value";
import { useState, useRef } from "react";

export const useDebounceState = <T>(
  init: T,
  onDebounceChange?: (value: T) => void,
  timeout = 500,
) => {
  const [state, setState] = useState(init);
  const [debounceState, setDebounceState] = useState(init);

  const initRef = useRef(init);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setStateValue = (value: ChangeValueParam<T>) => {
    const val = getChangeValue<T>(value, initRef.current);
    setState(val);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebounceState(val);
      if (val !== initRef.current) onDebounceChange?.(val);
    }, timeout);
  };

  return [state, setStateValue, debounceState] as const;
};
