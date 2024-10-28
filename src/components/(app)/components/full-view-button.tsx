import { Button } from "@/components/ui/button";
import { PiArrowsOutSimpleBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/state/store";
import { showMenu } from "@/state/slices/mini-menu";

export function FullViewButton() {
  const showFullMenu = useSelector(
    (store: RootState) => store.miniMenu.showFullMenu,
  );
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <Button
        size="icon"
        variant="outline"
        onClick={() => {
          dispatch(showMenu({ showFullMenu: !showFullMenu }));
        }}
      >
        <PiArrowsOutSimpleBold />
      </Button>
    </>
  );
}
