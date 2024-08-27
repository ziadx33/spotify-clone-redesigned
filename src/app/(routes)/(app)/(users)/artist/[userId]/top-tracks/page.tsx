import { TopTracks } from "@/components/top-tracks";
import { getUserTopTracks } from "@/server/actions/track";
import { getUserById } from "@/server/actions/verification-token";
import { getServerAuthSession } from "@/server/auth";
import { handleRequests } from "@/utils/handle-requests";
import { notFound } from "next/navigation";

export default async function Page({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const requests = [
    getServerAuthSession(),
    getUserById({ id: userId }),
  ] as const;
  const [user, fetchedUser] = await handleRequests(requests);
  if (user?.user.id !== fetchedUser?.id) notFound();
  const { data: tracks } = await getUserTopTracks({ user: user?.user });
  return <TopTracks tracks={tracks} />;
}
