"use client";

import { usePlaylists } from "@/hooks/use-playlists";
import { PlaylistItem } from "./playlist-item";
import { SkeletonPlaylists } from "@/components/artist/components/skeleton";
import { SortableList } from "./sortable-list";
import { type ReactNode } from "react";

export function PlaylistsSection({
  comps,
}: {
  comps: Record<string, ReactNode>;
}) {
  const { data, status } = usePlaylists();
  const isLoading = status === "loading";

  const items = data
    ?.slice(0, 8)
    .map((playlist) => <PlaylistItem data={playlist} key={playlist.id} />);

  return (
    <div className="flex gap-2">
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2.5 px-2">
        {!isLoading ? items : <SkeletonPlaylists amount={6} />}
      </div>

      <SortableList comps={comps} />
    </div>
  );
}
