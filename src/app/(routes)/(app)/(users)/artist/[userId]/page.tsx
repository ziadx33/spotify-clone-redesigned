import ClientProvider from "@/components/[clientId]/client-id-provider";
import { getUserById } from "@/server/actions/verification-token";
import { type GenerateMetadataProps } from "@/types";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: GenerateMetadataProps<{ userId: string }>): Promise<Metadata> {
  const id = (await params).userId;

  const user = await getUserById({ id });

  return {
    title: `${user?.name} | Spotify Clone`,
  };
}

export default function ArtistPage() {
  return <ClientProvider />;
}
