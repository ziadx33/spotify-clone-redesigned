import { Client } from "@/components/(routes)/(app)/artist/[clientId]";

export default function ArtistPage({ params }: { params: { userId: string } }) {
  return <Client artistId={params.userId} />;
}
