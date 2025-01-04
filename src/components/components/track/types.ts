import { type TrackFilters } from "@/types";
import { type Track, type Playlist, type User } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { type useIntersectionObserver } from "usehooks-ts";
import { type ReplaceDurationWithButton } from "../non-sort-table";

export type Props = {
  track: Track & { trackIndex: number };
  authors: User[];
  album?: Playlist;
  viewAs: TrackFilters["viewAs"];
  playlist?: Playlist;
  isAlbum?: boolean;
  showImage?: boolean;
  replacePlaysWithPlaylist?: boolean;
  showIndex?: boolean;
  replaceDurationWithButton?: ReplaceDurationWithButton;
  hidePlayButton?: boolean;
  hideViews?: boolean;
  className?: string;
  selected?: boolean;
  setSelectedTracks?: Dispatch<SetStateAction<string[]>>;
  intersectLastElementRef?: ReturnType<typeof useIntersectionObserver>["ref"];
  queueTypeId?: string;
  hideTrackContext?: boolean;
};

export type TrackProps =
  | ({ skeleton: false } & Props)
  | ({ skeleton: true } & Omit<
      Props,
      "track" | "authors" | "album" | "playlist"
    >);
