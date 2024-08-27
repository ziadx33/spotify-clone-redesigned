import { type Playlist, type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type AuthorProps = {
  author: User;
  playlist: Playlist;
};

export function Author({ author, playlist }: AuthorProps) {
  return (
    <Link
      href={`/artist/${author.id}?playlist=${playlist.id}`}
      className="flex h-fit w-full items-center gap-5 font-medium"
    >
      <Image
        src={author.image ?? ""}
        alt={author.name ?? ""}
        width={50}
        height={50}
        draggable="false"
        className="size-[50px] rounded-full"
      />
      <h3>{author.name}</h3>
    </Link>
  );
}
