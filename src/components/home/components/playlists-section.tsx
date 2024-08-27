"use client";

import { usePlaylists } from "@/hooks/use-playlists";
import { PlaylistItem } from "./playlist-item";
import { SkeletonPlaylists } from "@/components/artist/components/skeleton";

export function PlaylistsSection() {
  const { data, status } = usePlaylists();
  const isLoading = status === "loading";

  const items = data
    ?.slice(0, 8)
    .map((playlist) => <PlaylistItem data={playlist} key={playlist.id} />);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2.5 px-2">
      {!isLoading ? items : <SkeletonPlaylists amount={4} />}
    </div>
  );
}
