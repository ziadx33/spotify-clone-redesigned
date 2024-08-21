import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { type User, type Playlist } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

type ArtistsSectionProps = {
  data?: { playlists: Playlist[]; authors: User[] };
};

export function AlbumsSection({ data }: ArtistsSectionProps) {
  const { data: user } = useSession();
  const cards = useMemo(() => {
    if (!user?.user.id) return;
    console.log("idk", user.user.id);
    return (
      <RenderSectionItems
        cards={
          data?.playlists
            ?.filter(
              (album) =>
                album.creatorId !== user?.user.id && album.type === "ALBUM",
            )
            ?.map((album) => (
              <SectionItem
                key={album.id}
                description={`${format(album.createdAt, "YYY")} - ${data.authors.find((author) => author.id === album.creatorId)?.name}`}
                title={album.title}
                link={`/playlist/${album.id}`}
                image={album.imageSrc ?? ""}
                type="PLAYLIST"
                showPlayButton
              />
            )) ?? []
        }
        title="Albums"
      />
    );
  }, [user?.user.id, data]);
  return cards;
}
