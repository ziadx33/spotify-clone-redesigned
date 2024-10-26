"use client";

import { Artist } from "../artist";
import { User } from "../user";
import { useRouter } from "next/navigation";
import { getUserById } from "@/server/actions/verification-token";
import { useQuery } from "@tanstack/react-query";
import Loading from "../ui/loading";
import { useMemo } from "react";

type ClientProps = {
  artistId: string;
  playlistId?: string | null;
};

export function Client({ artistId, playlistId }: ClientProps) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: [`artist-page-data-${artistId}`],
    queryFn: async () => {
      const user = await getUserById({ id: artistId });
      return { user, isUser: user?.type === "USER" };
    },
  });

  const content = useMemo(() => {
    if (!playlistId && data?.user?.type === "ARTIST") {
      router.push("/");
      return null;
    }
    if (isLoading || !data?.user) return <Loading />;
    if (!data.user) router.push("/");
    return data.user.type === "ARTIST" && !data.isUser && playlistId ? (
      <Artist playlistId={playlistId} artist={data.user} />
    ) : (
      <User isUser={data?.isUser ?? false} user={data.user} />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  return content;
}
