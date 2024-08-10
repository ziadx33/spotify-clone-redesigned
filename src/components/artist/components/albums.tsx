"use client";

import { RenderTracks } from "./render-tracks";
import Loading from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@prisma/client";
import { getPopularTracks, getUserTopTracks } from "@/server/actions/track";
import { useSession } from "@/hooks/use-session";
import { handleRequests } from "@/utils/handle-requests";

export function HomeTab({ artist }: { artist: User }) {
  const user = useSession();
  console.log("Session Data:", user);

  const { data, isLoading } = useQuery({
    queryKey: [`${artist.id}-home`],
    queryFn: async () => {
      const requests = [
        await getPopularTracks({
          artistId: artist.id,
          range: { from: 0, to: 10 },
        }),
        await getUserTopTracks({
          user: user.data?.user,
          artistId: artist.id,
        }).then((res) => {
          console.log("User top tracks response:", res);
          return res;
        }),
      ] as const;

      const result = await handleRequests(requests);

      return { popular: result[0], artistTopListened: requests[1].data };
    },
  });

  console.log("Query Data:", data);

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
              data={data?.artistTopListened}
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
