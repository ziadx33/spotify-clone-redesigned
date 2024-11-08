import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { type User, type Playlist } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { type SearchClickFnType } from "./search-content";

type ArtistsSectionProps = {
  data?: { playlists: Playlist[]; authors: User[] };
  searchClickFn: SearchClickFnType;
};

export function AlbumsSection({ data, searchClickFn }: ArtistsSectionProps) {
  const { data: user } = useSession();
  const cards = useMemo(() => {
    if (!user?.user.id) return;
    return (
      <RenderSectionItems
        cards={
          data?.playlists
            ?.filter(
              (album) =>
                album.creatorId !== user?.user.id && album.type === "ALBUM",
            )
            ?.map((album) => {
              const fn = () =>
                searchClickFn({ searchPlaylist: album.id, type: "ARTIST" });
              return (
                <SectionItem
                  playlistData={album}
                  onClick={fn}
                  key={album.id}
                  description={`${format(album.createdAt, "YYY")} - ${data.authors.find((author) => author.id === album.creatorId)?.name}`}
                  title={album.title}
                  link={`/playlist/${album.id}`}
                  image={album.imageSrc ?? ""}
                  type="PLAYLIST"
                  showPlayButton
                />
              );
            }) ?? []
        }
        title="Albums"
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user.id, data]);
  return cards;
}
