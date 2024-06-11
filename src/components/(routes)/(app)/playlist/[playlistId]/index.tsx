"use client";

import { usePlaylist } from "@/hooks/use-playlist";
import { type Playlist } from "@prisma/client";

export function Playlist({ id }: { id: string }) {
  const { data } = usePlaylist(id);
  return <h1>Hi {data?.title}</h1>;
}
