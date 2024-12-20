"use client";

import { editNotFoundType } from "@/state/slices/not-found";
import dynamic from "next/dynamic";

const PlaylistPage = dynamic(() =>
  import("@/components/[playlistId]").then((file) => file.PlaylistPage),
);
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export function PlaylistProvider() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const playlistId = params.playlistId as string | null;
  if (!playlistId) {
    dispatch(editNotFoundType("PLAYLIST"));
    router.push("/404-error");
    return null;
  }
  return <PlaylistPage id={playlistId} />;
}
