import { type ReactNode } from "react";
import { AppProvider } from "./app-provider";
import { getPlaylists } from "@/server/actions/playlist";
import { getServerAuthSession } from "@/server/auth";
import { getFollowedArtists } from "@/server/actions/user";

export async function ServerAppDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const userData = await getServerAuthSession();
  const user = userData?.user;
  const playlists = await getPlaylists({
    creatorId: user?.id ?? "",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    playlistIds: user?.playlists ?? [],
  });
  const following = await getFollowedArtists({
    userId: userData?.user.id ?? "",
  });
  return (
    <AppProvider playlists={playlists} following={following ?? []}>
      {children}
    </AppProvider>
  );
}
