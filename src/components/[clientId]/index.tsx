"use client";

import { Artist } from "../artist";
import { User } from "../user";
import { useRouter } from "next/navigation";
import { getUserById } from "@/server/actions/verification-token";
import { useQuery } from "@tanstack/react-query";
import Loading from "../ui/loading";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { editNotFoundType } from "@/state/slices/not-found";
import { useUserData } from "@/hooks/use-user-data";

type ClientProps = {
  artistId: string;
  playlistId?: string | null;
};

export function Client({ artistId, playlistId }: ClientProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useUserData();

  const { data, isLoading } = useQuery({
    queryKey: [`client-page-${artistId}`],
    queryFn: async () => {
      const user = await getUserById({ id: artistId });

      return { user, isUser: user?.type === "USER" };
    },
  });

  useEffect(() => {
    if (!data) return;

    if (!data.user) {
      dispatch(editNotFoundType("ARTIST"));
      router.push("/404-error");
      return;
    }

    if (
      !playlistId &&
      data.user.type === "ARTIST" &&
      data.user.id !== user?.id
    ) {
      router.push("/");
    }
  }, [data, dispatch, router, playlistId, user?.id]);

  if (isLoading) return <Loading />;
  if (!data?.user) return null;

  return data.user.type === "ARTIST" && data.user.id !== user?.id ? (
    <Artist playlistId={playlistId ?? "unknown"} artist={data.user} />
  ) : (
    <User isUser={data.isUser} user={data.user} />
  );
}
