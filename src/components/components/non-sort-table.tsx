import {
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { type TracksSliceType } from "@/state/slices/tracks";
import { type Track as TrackType, type Playlist } from "@prisma/client";
import { BsClock } from "react-icons/bs";
import { Track } from "./track";
import { type TrackFilters } from "@/types";
import { memo, type Dispatch, type SetStateAction } from "react";
import { type useIntersectionObserver } from "usehooks-ts";

export type ReplaceDurationWithButton = {
  name: string;
  fn: (track: TrackType) => void | Promise<void>;
};

export type NonSortTableProps = {
  data?: Partial<TracksSliceType["data"]>;
  playlist?: Playlist;
  viewAs: TrackFilters["viewAs"];
  showTrackImage?: boolean;
  showHead?: boolean;
  replacePlaysWithPlaylist?: boolean;
  limit?: number;
  showIndex?: boolean;
  replaceDurationWithButton?: ReplaceDurationWithButton;
  hidePlayButton?: boolean;
  skeleton?: boolean;
  selectedTracks?: string[];
  setSelectedTracks?: Dispatch<SetStateAction<string[]>>;
  intersectLastElementRef?: ReturnType<typeof useIntersectionObserver>["ref"];
  showCaption?: boolean;
  isLoading?: boolean;
  queueTypeId?: string;
  showNoTracksMessage?: boolean;
  hideTrackContext?: boolean;
};

function Comp({
  data,
  playlist,
  viewAs,
  showTrackImage = true,
  showHead = true,
  replacePlaysWithPlaylist = false,
  limit,
  showIndex = true,
  replaceDurationWithButton,
  hidePlayButton = false,
  skeleton = false,
  selectedTracks,
  setSelectedTracks,
  intersectLastElementRef,
  showCaption,
  isLoading,
  queueTypeId,
  showNoTracksMessage = true,
  hideTrackContext,
}: NonSortTableProps) {
  const defTrackProps = {
    hidePlayButton: hidePlayButton,
    replacePlaysWithPlaylist: replacePlaysWithPlaylist,
    showImage: showTrackImage,
    isAlbum: true,
    replaceDurationWithButton: replaceDurationWithButton,
    playlist: playlist,
    viewAs: viewAs,
    showIndex: showIndex,
    queueTypeId: queueTypeId,
    hideTrackContext: hideTrackContext,
  };
  return (
    <>
      {(data?.tracks?.length ?? 0) === 0 && showCaption && !isLoading && (
        <TableCaption>no tracks in the album</TableCaption>
      )}
      {showHead && (
        <TableHeader>
          <TableRow>
            {showIndex && <TableHead className="w-0 pl-4 pr-0">#</TableHead>}
            <TableHead>Title</TableHead>
            {!hidePlayButton && (
              <TableHead>
                {!replacePlaysWithPlaylist ? "Plays" : "Album"}
              </TableHead>
            )}
            <TableHead>
              <BsClock size={15} />
            </TableHead>
            {setSelectedTracks && <TableHead />}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {!isLoading ? (
          (data?.tracks?.length ?? 0) > 0 ? (
            data?.tracks
              ?.slice(0, !limit ? data?.tracks?.length : limit)
              .sort((a, b) => a.order - b.order)
              .map((track, trackIndex) => (
                <Track
                  {...defTrackProps}
                  setSelectedTracks={setSelectedTracks}
                  selected={!!selectedTracks?.find((id) => id === track.id)}
                  skeleton={skeleton}
                  key={track.id}
                  intersectLastElementRef={intersectLastElementRef}
                  track={{ ...track, trackIndex }}
                  authors={data.authors!.filter(
                    (author) =>
                      track.authorId === author.id ||
                      track.authorIds.includes(author.id),
                  )}
                  album={data.albums!.find(
                    (album) => track.albumId === album.id,
                  )}
                />
              ))
          ) : showNoTracksMessage ? (
            <div className="grid h-36 place-items-center lowercase">
              no tracks in the album
            </div>
          ) : null
        ) : (
          Array.from({ length: 5 }).map((_, i) => (
            <Track skeleton key={i} {...defTrackProps} />
          ))
        )}
      </TableBody>
    </>
  );
}

export const NonSortTable = memo(Comp);
