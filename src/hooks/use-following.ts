import { type RootState } from "@/state/store";
import { useSelector } from "react-redux";

export function useFollowing() {
  const { status, error, data } = useSelector(
    (state: RootState) => state.following,
  );
  return { status, error, data };
}
