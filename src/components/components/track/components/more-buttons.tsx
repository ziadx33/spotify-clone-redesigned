import { type Playlist, type Track } from "@prisma/client";
import { TrackMoreButton } from "../../track-more-button";
import { LikeButton } from "./like-button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type MoreButtonsProps = {
  playlist?: Playlist;
  track?: Track;
  hideViews?: boolean;
};

export function MoreButtons({ playlist, track, hideViews }: MoreButtonsProps) {
  const isMobile = useIsMobile();
  return (
    <>
      <LikeButton track={track} />
      <TrackMoreButton
        playlist={playlist}
        track={track}
        className={cn(
          "transition-opacity lg:opacity-0 lg:group-hover:opacity-100",
          isMobile && !hideViews && "hidden",
        )}
      />
    </>
  );
}
