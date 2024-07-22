"use client";

import { Playlist } from "@/components/[playlistId]";
import { notFound, useParams } from "next/navigation";

export default function PlaylistPage() {
  const params = useParams();
  const playlistId = params.playlistId as string | null;
  if (!playlistId) notFound();
  return <Playlist id={playlistId} />;
}
