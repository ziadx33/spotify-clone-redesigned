import { type RootState } from "@/state/store";
import { useSelector } from "react-redux";

export function usePlaylists() {
  const { status, error, data } = useSelector(
    (state: RootState) => state.playlists,
  );
  return { status, error, data };
}
