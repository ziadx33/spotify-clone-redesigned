"use client";

import { useUserData } from "@/hooks/use-user-data";
import { editTrackById, getUserLikedSongs } from "@/server/actions/track";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { SearchTrack } from "../[playlistId]/components/recommended-search";
import { MusicPlayer } from "../[playlistId]/components/music-player";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { setTracks } from "@/state/slices/tracks";

export function LikedSongs() {
  const user = useUserData();
  const dispatch = useDispatch<AppDispatch>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`user-liked-tracks-${user.id}`],
    queryFn: async () => {
      console.log("bes");
      const tracks = await getUserLikedSongs(user.id);

      return tracks;
    },
  });

  useEffect(() => {
    if (!data) return;
    if (data.tracks.length > 0)
      dispatch(setTracks({ status: "success", data, error: null }));

    return () => {
      dispatch(setTracks({ status: "loading", data: null, error: null }));
    };
  }, [data, dispatch]);

  return (
    <div className="">
      {(data?.tracks.length ?? 0) > 0 || isLoading ? (
        <MusicPlayer showExploreButton={false} queueTypeId="liked tracks" />
      ) : (
        <div className="p-4">
          <SearchTrack
            addTrackToPlaylistFn={async (track) => {
              await editTrackById({
                id: track?.id,
                data: { likedUsers: [...(track?.likedUsers ?? []), user.id] },
              });
              await refetch();
            }}
            tableProps={{
              viewAs: "LIST",
              hidePlayButton: false,
            }}
          />
        </div>
      )}
    </div>
  );
}
