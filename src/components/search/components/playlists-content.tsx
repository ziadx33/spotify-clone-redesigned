import {
  SectionItemSkeleton,
  TracksListSkeleton,
} from "@/components/artist/components/skeleton";
import { SectionItem } from "@/components/components/section-item";
import { useSession } from "@/hooks/use-session";
import { getPlaylistsBySearchQuery } from "@/server/actions/playlist";
import { Playlist, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useMemo, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";

type PlaylistsContentProps = {
  playlists: { playlists: Playlist[]; authors: User[] };
  query: string;
};

export function PlaylistsContent({ playlists, query }: PlaylistsContentProps) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.2,
  });
  const currentTracksLength = useRef(10);
  const { isLoading, data, refetch } = useQuery({
    queryKey: [`playlists-tab-${query}`],
    queryFn: async () => {
      const fetchedTracks = await getPlaylistsBySearchQuery({
        query,
        amount: currentTracksLength.current ?? 10,
        restartLength: 3,
      });
      return fetchedTracks;
    },
  });
  useEffect(() => {
    if (!isIntersecting) return;
    currentTracksLength.current += 10;
    void refetch();
  }, [isIntersecting]);
  const cards = useMemo(() => {
    const datum = data ?? playlists;
    return (
      datum?.playlists
        ?.map((playlist, i) => {
          const author = datum.authors.find(
            (author) => author.id === playlist.creatorId,
          );
          if (author?.type === "ARTIST") return;
          return (
            <SectionItem
              key={playlist.id}
              description={`${format(playlist.createdAt, "YYY")} - ${author?.name}`}
              title={playlist.title}
              link={`/playlist/${playlist.id}`}
              image={playlist.imageSrc ?? ""}
              type="PLAYLIST"
              showPlayButton
              ref={i === datum?.playlists.length ? ref : null}
            />
          );
        })
        ?.filter((v) => v) ?? []
    );
  }, [data, playlists]);
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-2">
        {cards}
        {isLoading && <SectionItemSkeleton amount={10} />}
      </div>
    </div>
  );
}
