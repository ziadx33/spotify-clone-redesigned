import { type TracksSliceType } from "@/state/slices/tracks";
import { type RootState } from "@/state/store";
import { useSelector } from "react-redux";

export function useTracks(): TracksSliceType {
  const data = useSelector((state: RootState) => state.tracks);
  return data;
}
