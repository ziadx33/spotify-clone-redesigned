import { type ReactNode } from "react";
import { AppProvider } from "./app-provider";
import { getPlaylists } from "@/server/actions/playlist";
import { getServerAuthSession } from "@/server/auth";

export async function ServerAppDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const userData = await getServerAuthSession();
  const user = userData?.user;
  const playlists = await getPlaylists(user?.id ?? "");
  return <AppProvider playlists={playlists}>{children}</AppProvider>;
}
