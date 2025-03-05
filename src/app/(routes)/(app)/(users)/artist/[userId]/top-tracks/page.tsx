"use client";

import { TopTracks } from "@/components/top-tracks";
import { useUserData } from "@/hooks/use-user-data";
import { getUserTopTracks } from "@/server/queries/user";
import { useQuery } from "@tanstack/react-query";

export default function TopTracksPage() {
  const user = useUserData();
  const { data } = useQuery({
    queryKey: [`top-user-tracks-${user?.id}`],
    queryFn: async () => {
      const data = await getUserTopTracks({ userId: user.id });
      return data.data;
    },
  });
  return <TopTracks tracks={data} />;
}
