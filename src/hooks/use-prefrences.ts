import { type RootState } from "@/state/store";
import { useSelector } from "react-redux";

export function usePrefrences() {
  const prefrences = useSelector((value: RootState) => value.prefrence);

  return prefrences;
}
