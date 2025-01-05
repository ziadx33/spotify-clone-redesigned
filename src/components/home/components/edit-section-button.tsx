import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrefrences } from "@/hooks/use-prefrences";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { editPrefrence } from "@/state/slices/prefrence";
import { type AppDispatch } from "@/state/store";
import { useCallback } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";
import { TiPin } from "react-icons/ti";
import { useDispatch } from "react-redux";

type EditSectionButtonProps = {
  userId: string;
  sectionId: string;
};

export function EditSectionButton({
  userId,
  sectionId,
}: EditSectionButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: prefrence } = usePrefrences();
  type PrefrenceRule = "pinnedHomeSections" | "hiddenHomeSections";
  const isExistInRule = useCallback(
    (rule: PrefrenceRule) => {
      return prefrence?.[rule].includes(sectionId);
    },
    [prefrence, sectionId],
  );
  const buttonsHandler = async (rule: PrefrenceRule) => {
    const isAlreadyExist = isExistInRule(rule);
    dispatch(
      editPrefrence({
        [rule]: !isAlreadyExist
          ? [...(prefrence?.[rule] ?? []), sectionId]
          : prefrence?.[rule].filter((rule) => rule !== sectionId),
      }),
    );
    await editUserPrefrence({
      userId,
      data: {
        [rule]: isAlreadyExist
          ? prefrence?.[rule].filter((rule) => rule !== sectionId)
          : [sectionId],
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <BsThreeDots />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => buttonsHandler("pinnedHomeSections")}
          className="flex gap-2"
        >
          <TiPin />
          {isExistInRule("pinnedHomeSections") ? "Unpin" : "Pin"} to home
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => buttonsHandler("hiddenHomeSections")}
          className="flex gap-2"
        >
          <MdOutlineBlock />
          {isExistInRule("hiddenHomeSections") ? "Unhide" : "Hide"} to home
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
