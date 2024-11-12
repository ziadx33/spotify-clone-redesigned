import { type TrackSliceType } from "@/state/slices/tracks";
import { IoShareOutline } from "react-icons/io5";

type ShareButtonProps = {
  currentItemData?: TrackSliceType;
  isExploreFetchLoading: boolean;
};

export function ShareButton({
  currentItemData,
  isExploreFetchLoading,
}: ShareButtonProps) {
  const shareHandler = async () => {
    await navigator.clipboard.writeText(
      `${location.origin}/playlist/${currentItemData?.album?.id}`,
    );
  };
  return (
    <button
      onClick={shareHandler}
      disabled={isExploreFetchLoading}
      className="lex size-fit flex-col items-center rounded-full"
    >
      <IoShareOutline size={23} className="fill-muted-foreground" />
    </button>
  );
}
