import { Navigate } from "@/components/navigate";
import { type Playlist } from "@prisma/client";

type AlbumLinkProps = {
  skeleton: boolean;
  album?: Playlist;
};

export function AlbumLink({ skeleton, album }: AlbumLinkProps) {
  if (skeleton || !album) return null;

  return (
    <Navigate
      data={{
        href: `/playlist/${album.id}`,
        title: album.title ?? "unknown",
        type: "PLAYLIST",
      }}
      href={`/playlist/${album.id}`}
      className="hover:underline"
    >
      {album.title}
    </Navigate>
  );
}
