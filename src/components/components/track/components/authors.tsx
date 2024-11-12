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
        <div
          key={author.id}
          className="line-clamp-1 flex text-muted-foreground"
        >
          <AuthorContext
            artist={author}
            playlistId={playlistId ?? "liked-tracks"}
          >
            <Link
              href={`/artist/${author.id}?playlist=${playlistId ?? "liked-tracks"}`}
            >
              {author.name}
            </Link>
          </AuthorContext>

          {index === authors.length - 1 ? "" : ","}
        </div>
      ))}
    </>
  );
}
