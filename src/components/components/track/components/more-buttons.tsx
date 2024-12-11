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
        className=" opacity-0 transition-opacity group-hover:opacity-100"
      />
    </>
  );
}
