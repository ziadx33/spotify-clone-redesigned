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
  playlistId?: string;
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
    if (!playlistId) {
      router.push("/");
      return null;
    }
    if (isLoading || !data) return <Loading />;
    return data?.user ? (
      data.user.type === "ARTIST" && !data.isUser ? (
        <Artist playlistId={playlistId} artist={data.user} />
      ) : (
        <User isUser={data?.isUser ?? false} user={data.user} />
      )
    ) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  return content;
}
