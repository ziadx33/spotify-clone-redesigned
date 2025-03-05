"use client";

import { RenderTracks } from "./render-tracks";
import Loading from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@prisma/client";
import { handleRequests } from "@/utils/handle-requests";
import { useUserData } from "@/hooks/use-user-data";
import { getPopularTracks } from "@/server/queries/track";
import { getUserTopTracks } from "@/server/queries/user";

export function HomeTab({ artist }: { artist: User }) {
  const user = useUserData();

  const { data, isLoading } = useQuery({
    queryKey: [`${artist.id}-home`],
    queryFn: async () => {
      const requests = [
        await getPopularTracks({
          artistId: artist.id,
          range: { from: 0, to: 10 },
        }),
        await getUserTopTracks({
          userId: user.id,
          artistId: artist.id,
        }).then((res) => {
          return res;
        }),
      ] as const;

      const result = await handleRequests(requests);

      return { popular: result[0], artistTopListened: requests[1].data };
    },
  });

  return (
    <div className="flex min-h-full ">
      {!isLoading && data ? (
        <div className="flex-1 ">
          <div className="flex flex-col gap-2">
            <RenderTracks
              tracksProps={{
                hideViews: true,
              }}
              title="Your most played"
              data={{
                authors: data?.artistTopListened.authors ?? [],
                tracks: data?.artistTopListened.tracks ?? [],
              }}
            />
            <RenderTracks title="Popular" data={data?.popular} />
          </div>
        </div>
      ) : (
        <Loading className="h-96" />
      )}
      <div className="flex-1" />
    </div>
  );
}
