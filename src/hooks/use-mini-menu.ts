import { showMenu } from "@/state/slices/mini-menu";
import { type AppDispatch, type RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useQueue } from "./use-queue";

export function useMiniMenu() {
  const { value, showQueue, showFullMenu } = useSelector(
    (value: RootState) => value.miniMenu,
  );
  const {
    data: { status },
  } = useQueue();
  const enableButton = status === "success";
  type SetBoolean = ((v: boolean) => boolean) | boolean;
  const dispatch = useDispatch<AppDispatch>();
  const setShowMenu = (val: SetBoolean, isQueue: SetBoolean) => {
    if (status !== "success") return;
    if (typeof val === "function")
      return dispatch(
        showMenu({
          value: val(value),
          showQueue:
            typeof isQueue === "boolean" ? isQueue : isQueue(showQueue),
        }),
      );
    return dispatch(
      showMenu({
        value: val,
        showQueue: typeof isQueue === "boolean" ? isQueue : isQueue(showQueue),
      }),
    );
  };
  return { value, setShowMenu, enableButton, showQueue, showFullMenu };
}
