import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { type User, type Playlist } from "@prisma/client";
import { format } from "date-fns";
import { useMemo } from "react";
import { type SearchClickFnType } from "./search-content";
import { useUserData } from "@/hooks/use-user-data";

type ArtistsSectionProps = {
  data?: { playlists: Playlist[]; authors: User[] };
  searchClickFn: SearchClickFnType;
};

export function PlaylistsSection({ data, searchClickFn }: ArtistsSectionProps) {
  const user = useUserData();
  const cards = useMemo(() => {
    if (!user.id) return;
    return (
      <RenderSectionItems
        cards={
          data?.playlists
            ?.map((playlist) => {
              const author = data.authors.find(
                (author) => author.id === playlist.creatorId,
              );
              if (author?.type === "ARTIST") return;
              const fn = () =>
                searchClickFn({
                  searchPlaylist: playlist.id,
                  type: "PLAYLIST",
                });
              return (
                <SectionItem
                  playlistData={playlist}
                  onClick={fn}
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
  }, [user.id, data]);
  return cards;
}
