import { useEffect, useRef } from "react";

export function useSkipFirstEffect(
  callback: () => void,
  deps: React.DependencyList = [],
): void {
  const hasMounted = useRef<boolean>(false);

  useEffect(() => {
    if (hasMounted.current) {
      callback();
    } else {
      hasMounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
