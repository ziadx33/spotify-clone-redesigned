import { Skeleton } from "@/components/ui/skeleton";
import { useFollow } from "@/hooks/use-follow";
import { type TrackSliceType } from "@/state/slices/tracks";
import { ClampNumber } from "@/utils/clamp-number";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";

type FollowButtonProps = {
  currentItemData?: TrackSliceType;
  isExploreFetchLoading: boolean;
};

export function FollowButton({
  currentItemData,
  isExploreFetchLoading,
}: FollowButtonProps) {
  const { toggle, isFollowing, isFollowed } = useFollow({
    artist: currentItemData?.author,
    playlistId: currentItemData?.album?.id ?? "unknown",
  });
  const router = useRouter();
  const goToArtistHandler = () =>
    router.push(
      `/artist/${currentItemData?.track?.authorId}?playlist=${currentItemData?.track?.albumId}`,
    );
  const followersClamp = useMemo(
    () =>
      !isExploreFetchLoading
        ? ClampNumber(currentItemData?.author?.followers.length)
        : 0,
    [currentItemData?.author?.followers.length, isExploreFetchLoading],
  );
  return (
    <div className="flex h-fit w-full flex-col items-center">
      <div
        onClick={goToArtistHandler}
        className="relative size-[50px] cursor-pointer rounded-full border"
      >
        {!isExploreFetchLoading ? (
          <Image
            fill
            alt={currentItemData?.author?.name ?? ""}
            src={currentItemData?.author?.image ?? ""}
            className="rounded-full"
          />
        ) : (
          <Skeleton className="size-full rounded-full" />
        )}
        <button
          disabled={isFollowing || isExploreFetchLoading}
          onClick={(e) => {
            e.stopPropagation();
            void toggle(currentItemData?.author);
          }}
          className="absolute -bottom-1 left-1/2 grid size-4 -translate-x-1/2 place-items-center rounded-full bg-white [&>*]:fill-primary-foreground"
        >
          {!isFollowed ? <FaPlus size={10} /> : <FaCheck size={8} />}
        </button>
      </div>
      <span className="z-10 mt-2.5 text-xs text-muted-foreground">
        {followersClamp}
      </span>
    </div>
  );
}
