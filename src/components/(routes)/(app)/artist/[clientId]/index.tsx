import { getUserById } from "@/server/actions/user";
import { Artist } from "./components/artist";
import { User } from "./components/user";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";

export async function Client({ artistId }: { artistId: string }) {
  const user = await getUserById(artistId);
  const userData = await getServerAuthSession();
  if (!user) notFound();
  return user?.type === "ARTIST" && userData?.user.id !== user.id ? (
    <Artist artist={user} />
  ) : (
    <User user={user} />
  );
}
