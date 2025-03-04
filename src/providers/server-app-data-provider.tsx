import { type ReactNode } from "react";
import { AppProvider } from "./app-provider";
import { getServerAuthSession } from "@/server/auth";
import { getUserFollowing } from "@/server/queries/user";
import { getPlaylists } from "@/server/queries/playlist";
import { type PlaylistsSliceType } from "@/state/slices/playlists";

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
  const following = await getUserFollowing({
    id: userData?.user.id ?? "",
    userType: "ARTIST",
  });
  console.log("babababab", playlists);
  return (
    <AppProvider
      playlists={playlists as PlaylistsSliceType}
      following={following ?? []}
    >
      {children}
    </AppProvider>
  );
}
