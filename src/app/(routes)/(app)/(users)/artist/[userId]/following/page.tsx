import { Following } from "@/components/following";
import { getFollowedArtists, getUserById } from "@/server/actions/user";
import { getServerAuthSession } from "@/server/auth";
import { handleRequests } from "@/utils/handle-requests";
import { notFound } from "next/navigation";

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const requests = [getServerAuthSession(), getUserById(userId)] as const;
  const [user, fetchedUser] = await handleRequests(requests);
  if (user?.user.id !== fetchedUser?.id) notFound();
  const artists = await getFollowedArtists({ userId: fetchedUser?.id ?? "" });

  return <Following artists={artists} />;
}
