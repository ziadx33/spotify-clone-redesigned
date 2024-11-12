import { Skeleton } from "@/components/ui/skeleton";
import { useAddToPlaylist } from "@/hooks/use-add-to-playlist";
import { getNumberSavedPlaylist } from "@/server/actions/playlist";
import { type TrackSliceType } from "@/state/slices/tracks";
import { ClampNumber } from "@/utils/clamp-number";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

type AddToLibraryButtonProps = {
  currentItemData?: TrackSliceType;
  isExploreFetchLoading: boolean;
};

export function AddToLibraryButton({
  currentItemData,
  isExploreFetchLoading,
}: AddToLibraryButtonProps) {
  const {
    isLoading,
    toggle: toggleAddToPlaylist,
    isAddedToLibrary,
  } = useAddToPlaylist({
    playlist: currentItemData?.album,
  });

  const { data, isLoading: isSavedNumLoading } = useQuery({
    queryKey: [`saved-album-num-${currentItemData?.album?.id}`],
    queryFn: async () => {
      const data = getNumberSavedPlaylist({
        playlistId: currentItemData!.album!.id,
      });
      return data;
    },
    enabled: !!currentItemData?.album?.id && !isExploreFetchLoading,
  });

  const savedNumberClamp = useMemo(() => ClampNumber(data), [data]);
  return (
    <button
      disabled={isLoading || isExploreFetchLoading}
      onClick={toggleAddToPlaylist}
      className="relative flex size-fit flex-col items-center rounded-full"
    >
      {isAddedToLibrary ? (
        <FaBookmark size={23} className="fill-primary" />
      ) : (
        <FaRegBookmark size={23} className="fill-muted-foreground" />
      )}
      <span className="mt-1 text-xs text-muted-foreground">
        {!isSavedNumLoading ? (
          savedNumberClamp
        ) : (
          <Skeleton className="h-4 w-6 rounded-sm" />
        )}
      </span>
    </button>
  );
}
