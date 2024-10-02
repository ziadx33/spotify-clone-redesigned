import { type RootState } from "@/state/store";
import { type MutableRefObject, useRef } from "react";
import { useSelector } from "react-redux";

export default function useSelectorRef<T>(
  selectHandler: (state: RootState) => T,
): MutableRefObject<T> {
  const ref = useRef<T>();

  useSelector(selectHandler, (_, b: T) => {
    ref.current = b;
    return true;
  });

  return ref as MutableRefObject<T>;
}
