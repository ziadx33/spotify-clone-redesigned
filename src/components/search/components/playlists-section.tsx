import {
  type NavigateClickParams,
  SectionItem,
} from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { type User, type Playlist } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

type ArtistsSectionProps = {
  data?: { playlists: Playlist[]; authors: User[] };
  searchClickFn: NavigateClickParams;
};

export function PlaylistsSection({ data, searchClickFn }: ArtistsSectionProps) {
  const { data: user } = useSession();
  const cards = useMemo(() => {
    if (!user?.user.id) return;
    return (
      <RenderSectionItems
        cards={
          data?.playlists
            ?.map((playlist) => {
              const author = data.authors.find(
                (author) => author.id === playlist.creatorId,
              );
              if (author?.type === "ARTIST") return;
              return (
                <SectionItem
                  onClick={searchClickFn}
                  key={playlist.id}
                  description={`${format(playlist.createdAt, "YYY")} - ${author?.name}`}
                  title={playlist.title}
                  link={`/playlist/${playlist.id}`}
                  image={playlist.imageSrc ?? ""}
                  type="PLAYLIST"
                  showPlayButton
                />
              );
            })
            .filter((v) => v) ?? []
        }
        title="Playlists"
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user.id, data]);
  return cards;
}
