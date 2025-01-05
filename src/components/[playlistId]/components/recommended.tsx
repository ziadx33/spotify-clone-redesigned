import { type NonSortTableProps } from "@/components/components/non-sort-table";
import { Button } from "@/components/ui/button";
import {
  addTrackToPlaylistToDB,
  getRecommendedTracks,
} from "@/server/actions/track";
import { addTrack } from "@/state/slices/tracks";
import { type AppDispatch } from "@/state/store";
import { type Track, type User, type Playlist } from "@prisma/client";
import { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { RecommendedTracks } from "./recommended-tracks";
import { SearchTrack } from "./recommended-search";

type RecommendProps = {
  playlist?: Playlist | null;
  artists?: User[] | null;
  tracks?: Track[] | null;
  playlistId: string;
};

export type TablePropsType = Omit<NonSortTableProps, "data">;

export function Recommended({
  playlist,
  artists,
  tracks,
  playlistId,
}: RecommendProps) {
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading } = useQuery({
    queryKey: [`recommended-album-${playlistId}`],
    queryFn: async () => {
      const data = await getRecommendedTracks({
        artistIds: artists?.map((artist) => artist.id) ?? [],
        trackIds: tracks?.map((track) => track.id) ?? [],
      });
      return data;
    },
    enabled: !!tracks && !!artists,
    throwOnError: true,
  });

  const tableProps: TablePropsType = {
    limit: 10,
    viewAs: "LIST",
    replacePlaysWithPlaylist: true,
    showHead: false,
    showIndex: false,
  } as const;
  useEffect(() => {
    if (playlist) tableProps.playlist = playlist;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist]);

  const addTrackToPlaylistFn = async (track: Track) => {
    const addData = { playlistId: playlist?.id ?? "", trackId: track.id };

    void addTrackToPlaylistToDB(addData);
    dispatch(
      addTrack({
        trackData: track,
        artists:
          data?.authors?.filter(
            (author) =>
              track.authorIds.includes(author.id) ||
              track.authorId === author.id,
          ) ?? [],
        playlists:
          data?.albums?.filter((playlist) =>
            track.playlists.includes(playlist.id),
          ) ?? [],
      }),
    );
  };

  return (
    <div className="mt-4 flex flex-col">
      <div className="flex justify-end">
        <Button
          disabled={!playlist || isLoading}
          size={showSearch ? "icon" : undefined}
          variant="ghost"
          onClick={() => setShowSearch((v) => !v)}
        >
          {!showSearch ? "find more" : <BsX />}
        </Button>
      </div>
      {showSearch && (
        <SearchTrack
          addTrackToPlaylistFn={addTrackToPlaylistFn}
          tableProps={tableProps}
        />
      )}
      <RecommendedTracks
        addTrackToPlaylistFn={addTrackToPlaylistFn}
        data={data}
        isLoading={isLoading}
        tableProps={tableProps}
        artists={artists}
        playlist={playlist}
        tracks={tracks}
      />
    </div>
  );
}
