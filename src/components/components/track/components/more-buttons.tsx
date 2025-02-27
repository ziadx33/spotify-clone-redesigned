import { type Playlist, type Track } from "@prisma/client";
import { TrackMoreButton } from "../../track-more-button";
import { LikeButton } from "./like-button";

type MoreButtonsProps = {
  playlist?: Playlist;
  track?: Track;
};

export function MoreButtons({ playlist, track }: MoreButtonsProps) {
  return (
    <>
      <LikeButton track={track} />
      <TrackMoreButton
        playlist={playlist}
        track={track}
        className=" transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
      />
    </>
  );
}
