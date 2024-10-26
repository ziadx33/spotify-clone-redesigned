"use client";

import { TopTracks } from "@/components/top-tracks";
import { useSession } from "@/hooks/use-session";
import { getUserTopTracks } from "@/server/actions/track";
import { useQuery } from "@tanstack/react-query";

export default function TopTracksPage() {
  const { data: user } = useSession();
  const { data } = useQuery({
    queryKey: [`top-user-tracks-${user?.user?.id}`],
    queryFn: async () => {
      const data = await getUserTopTracks({ user: user!.user });
      return data.data;
    },
    enabled: !!user,
  });
  return <TopTracks tracks={data} />;
}
