import { type RootState } from "@/state/store";
import { useSelector } from "react-redux";

export const useUserData = () => {
  const { data } = useSelector((state: RootState) => state.user);

  return data;
};
