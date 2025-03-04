import { PlaylistProvider } from "@/components/[playlistId]/playlist-provider";
import { getPlaylist } from "@/server/queries/playlist";
import { getUser } from "@/server/queries/user";
import { type GenerateMetadataProps } from "@/types";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: GenerateMetadataProps<{ playlistId: string }>): Promise<Metadata> {
  const id = (await params).playlistId;

  const playlist = await getPlaylist({ id });
  const creatorData = await getUser({ id: playlist?.creatorId });

  return {
    title: `${playlist?.title} - playlist by ${creatorData?.name}`,
  };
}

export default function Playlist() {
  return <PlaylistProvider />;
}
