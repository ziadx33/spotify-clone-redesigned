"use client";

import { usePlaylists } from "@/hooks/use-playlists";
import { PlaylistItem } from "./playlist-item";
import { SkeletonPlaylists } from "@/components/artist/components/skeleton";
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

  const items = (data?.length ?? 0 >= 6 ? data?.slice(0, 6) : data)?.map(
    (playlist) => (
      <PlaylistContext playlist={playlist} key={playlist.id} asChild={false}>
        <PlaylistItem data={playlist} />
      </PlaylistContext>
    ),
  );

  return (items?.length ?? 0) > 0 ? (
    <div className="flex w-full gap-2 pt-4">
      <div className="flex h-fit w-full flex-wrap gap-2 px-2 [&>div]:hidden">
        {!isLoading ? items : <SkeletonPlaylists amount={6} />}
      </div>

      {/* <SortableList comps={comps} /> */}
    </div>
  ) : null;
}
