import { PlaylistIdLayout } from "@/components/[playlistId]/layout";
import { getTracksByPlaylistId } from "@/server/actions/track";
import { type ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ playlistId: string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
  const { playlistId } = await params;
  const tracks = await getTracksByPlaylistId(playlistId);

  return (
    <PlaylistIdLayout tracks={tracks} id={playlistId}>
      {children}
    </PlaylistIdLayout>
  );
}
