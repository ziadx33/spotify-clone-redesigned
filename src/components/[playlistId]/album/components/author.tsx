import { type Playlist, type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { AuthorContext } from "../../../contexts/author-context";

type AuthorProps = {
  author: User;
  playlist: Playlist | null;
  addContext?: boolean;
};

export function Author({ author, playlist, addContext = true }: AuthorProps) {
  const playlistId = playlist?.id ?? "unknown";
  const content = (
    <Link
      href={`/artist/${author.id}?playlist=${playlistId}`}
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
  return addContext ? (
    <AuthorContext artist={author} playlistId={playlistId}>
      {content}
    </AuthorContext>
  ) : (
    content
  );
}
