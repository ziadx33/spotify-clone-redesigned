import { type RootState } from "@/state/store";
import { useSelector } from "react-redux";

export function useExplore() {
  const data = useSelector((state: RootState) => state.explore);
  return { data };
}
