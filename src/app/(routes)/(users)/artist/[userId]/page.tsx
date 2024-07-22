import { Client } from "@/components/[clientId]";

export default function ArtistPage({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { playlist?: string };
}) {
  return <Client playlistId={searchParams.playlist} artistId={params.userId} />;
}
