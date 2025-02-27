import { AuthorContext } from "@/components/contexts/author-context";
import { type User } from "@prisma/client";
import Link from "next/link";

type TrackAuthorsProps = {
  authors: User[];
  playlistId?: string;
};

export function Authors({ authors, playlistId }: TrackAuthorsProps) {
  return (
    <>
      {authors.map((author, index) => (
        <AuthorContext
          artist={author}
          key={author.id}
          playlistId={playlistId ?? "liked-tracks"}
        >
          <Link
            className="line-clamp-1 flex text-nowrap text-muted-foreground"
            href={`/artist/${author.id}?playlist=${playlistId ?? "liked-tracks"}`}
          >
            {author.name}
            {index === authors.length - 1 ? "" : ","}
          </Link>
        </AuthorContext>
      ))}
    </>
  );
}
