"use client";

import { usePlaylists } from "@/hooks/use-playlists";
import { Playlist } from "./playlist";
import Loading from "@/components/ui/loading";

export function Playlists() {
  const { status, data: playlists, error } = usePlaylists();
  if (status === "loading") return <Loading />;
  if (status === "error") return <h1>{error}</h1>;
  return (
    <div className="flex flex-col gap-1">
      {playlists?.map((playlist) => (
        <Playlist key={playlist.id} {...playlist} />
      ))}
    </div>
  );
}
