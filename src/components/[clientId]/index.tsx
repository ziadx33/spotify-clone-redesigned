import { Artist } from "../artist";
import { User } from "../user";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/server/auth";
import { type User as UserType } from "@prisma/client";
import { getUserById } from "@/server/actions/verification-token";

type ClientProps = {
  artistId: string;
  playlistId?: string;
};

export async function Client({ artistId, playlistId }: ClientProps) {
  const userData = await getServerAuthSession();
  let user: UserType | null | undefined = userData?.user;
  const isUser = artistId === userData?.user.id;

  if (!isUser) user = await getUserById({ id: artistId });

  if (!user || (user.type === "ARTIST" && !isUser && !playlistId))
    return notFound();

  return user.type === "ARTIST" && !isUser ? (
    <Artist playlistId={playlistId!} artist={user} />
  ) : (
    <User isUser={isUser} user={user} />
  );
}
