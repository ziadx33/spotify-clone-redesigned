import { SectionItem } from "@/components/components/section-item";
import { type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { SectionItemSkeleton } from "../../skeleton";
import { getTracksByIds } from "@/server/actions/track";

export function SinglesTab({ artist }: { artist: User }) {
  const { data, isLoading } = useQuery({
    queryKey: [`singles-tab-${artist.id}`],
    queryFn: async () => {
      const res = await getTracksByIds({
        artistId: artist.id,
      });
      return res;
    },
  });
  return (
    <div className="mt-8 flex flex-col">
      <h1 className="mb-4 text-3xl font-bold">Singles</h1>
      <div className="flex flex-wrap">
        {!isLoading && data ? (
          data
            ?.sort(
              (a, b) =>
                new Date(b.dateAdded).getTime() -
                new Date(a.dateAdded).getTime(),
            )
            ?.map((track) => (
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
