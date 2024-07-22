import { PublicPlaylists } from "@/components/public-playlists";
import { getPlaylists } from "@/server/actions/playlist";
import { getUserById } from "@/server/actions/user";
import { getServerAuthSession } from "@/server/auth";
import { handleRequests } from "@/utils/handle-requests";
import { type User } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const requests = [getServerAuthSession(), getUserById(userId)] as const;
  const [userData, fetchedUser] = await handleRequests(requests);
  let user: User | null | undefined = userData?.user;
  if (user?.id !== fetchedUser?.id) user = fetchedUser;
  if (!user) notFound();
  const data = await getPlaylists({
    creatorId: user.id,
    playlistIds: [],
  });
  return <PublicPlaylists artist={user} albums={data.data ?? []} />;
}
