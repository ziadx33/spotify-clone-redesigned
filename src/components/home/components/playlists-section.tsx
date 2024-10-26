"use client";

import { usePlaylists } from "@/hooks/use-playlists";
import { PlaylistItem } from "./playlist-item";
import { SkeletonPlaylists } from "@/components/artist/components/skeleton";
import { SortableList } from "./sortable-list";
import { type ReactNode } from "react";
import { PlaylistContext } from "@/components/contexts/playlist-context";

export function PlaylistsSection({
  comps,
}: {
  comps: Record<string, ReactNode>;
}) {
  const {
    data: { data, status },
  } = usePlaylists();
  const isLoading = status === "loading";

  const items = data?.slice(0, 6).map((playlist) => (
    <PlaylistContext playlist={playlist} key={playlist.id} asChild={false}>
      <PlaylistItem data={playlist} />
    </PlaylistContext>
  ));

  return (items?.length ?? 0) > 0 ? (
    <div className="flex gap-2 pt-4">
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2.5 px-2">
        {!isLoading ? items : <SkeletonPlaylists amount={6} />}
      </div>

      <SortableList comps={comps} />
    </div>
  ) : null;
}
