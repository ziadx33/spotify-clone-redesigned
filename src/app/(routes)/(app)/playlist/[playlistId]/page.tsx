"use client";

import dynamic from "next/dynamic";

const PlaylistPage = dynamic(
  () => import("@/components/[playlistId]").then((file) => file.PlaylistPage),
  {
    ssr: false,
  },
);
import { notFound, useParams } from "next/navigation";

export default function Playlist() {
  const params = useParams();
  const playlistId = params.playlistId as string | null;
  if (!playlistId) notFound();
  return <PlaylistPage id={playlistId} />;
}
