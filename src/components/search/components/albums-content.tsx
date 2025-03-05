import { SectionItemSkeleton } from "@/components/artist/components/skeleton";
import { SectionItem } from "@/components/components/section-item";
import { type Playlist, type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useMemo, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { type SearchClickFnType } from "./search-content";
import { useUserData } from "@/hooks/use-user-data";
import { getPlaylistsBySearchQuery } from "@/server/queries/playlist";

type AlbumsContentProps = {
  playlists: { playlists: Playlist[]; authors: User[] } | null;
  query: string;
  searchClickFn: SearchClickFnType;
};

export function AlbumsContent({
  playlists,
  query,
  searchClickFn,
}: AlbumsContentProps) {
  const user = useUserData();
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.2,
  });
  const currentAlbumsLength = useRef(10);
  const { isLoading, data, refetch } = useQuery({
    queryKey: [`albums-tab-${query}`],
    queryFn: async () => {
      const fetchedTracks = await getPlaylistsBySearchQuery({
        query,
        amount: currentAlbumsLength.current ?? 10,
        restartLength: 3,
      });
      return fetchedTracks;
    },
  });
  useEffect(() => {
    if (!isIntersecting) return;
    currentAlbumsLength.current += 10;
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);
  const cards = useMemo(() => {
    if (!user?.id) return;
    const datum = data ?? playlists;
    return (
      datum?.playlists
        ?.filter(
          (album) => album.creatorId !== user?.id && album.type === "ALBUM",
        )
        ?.map((album, i) => {
          const fn = () =>
            searchClickFn({ searchPlaylist: album.id, type: "PLAYLIST" });
          return (
            <SectionItem
              playlistData={album}
              key={album.id}
              description={`${format(album.createdAt, "YYY")} - ${datum.authors.find((author) => author.id === album.creatorId)?.name}`}
              title={album.title}
              onClick={fn}
              link={`/playlist/${album.id}`}
              image={album.imageSrc ?? ""}
              type="PLAYLIST"
              showPlayButton
              ref={i === datum.playlists.length ? ref : null}
            />
          );
        }) ?? []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, playlists, user?.id]);
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-2">
        {cards}
        {(isLoading || !user?.id) && <SectionItemSkeleton amount={10} />}
      </div>
    </div>
  );
}
