import { getUserById } from "@/server/actions/user";
import { Artist } from "./components/artist";
import { User } from "./components/user";
import { notFound } from "next/navigation";

export async function Client({ artistId }: { artistId: string }) {
  const user = await getUserById(artistId);
  if (!user) notFound();
  return user?.type === "ARTIST" ? (
    <Artist artist={user} />
  ) : (
    <User user={user} />
  );
}
