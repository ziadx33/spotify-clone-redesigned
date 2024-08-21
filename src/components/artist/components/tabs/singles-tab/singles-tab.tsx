import { SectionItem } from "@/components/components/section-item";
import { type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { SectionItemSkeleton } from "../../skeleton";
import { getTracksByIds } from "@/server/actions/track";
import { useMemo } from "react";

type SinglesTab = {
  artist: User;
  query: string | null;
};

export function SinglesTab({ artist, query }: SinglesTab) {
  const { data, isLoading } = useQuery({
    queryKey: [`singles-tab-${artist.id}`],
    queryFn: async () => {
      const res = await getTracksByIds({
        artistId: artist.id,
      });
      return res;
    },
  });
  const tracks = useMemo(() => {
    if (isLoading) return [];
    const sortedTracks = data?.sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
    );
    const filteredTracks = query
      ? sortedTracks?.filter((track) =>
          track.title.toLowerCase().includes(query?.toLowerCase().trim() ?? ""),
        )
      : [];
    return filteredTracks?.length === 0 ? sortedTracks : filteredTracks;
  }, [isLoading, data, query]);

  return (
    <div className="mt-8 flex flex-col">
      <h1 className="mb-4 text-3xl font-bold">Singles</h1>
      <div className="flex flex-wrap">
        {!isLoading && data ? (
          tracks?.map((track) => (
            <SectionItem
              key={track.id}
              description={`${format(new Date(track.dateAdded), "YYY")}`}
              link={`/playlist/${track.id}`}
              image={track.imgSrc}
              title={track.title}
              alt={track.title}
              type="PLAYLIST"
              showPlayButton
            />
          ))
        ) : (
          <SectionItemSkeleton amount={5} />
        )}
      </div>
    </div>
  );
}
