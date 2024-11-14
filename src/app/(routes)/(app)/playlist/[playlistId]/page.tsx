"use client";

import { editNotFoundType } from "@/state/slices/not-found";
import dynamic from "next/dynamic";

const PlaylistPage = dynamic(
  () => import("@/components/[playlistId]").then((file) => file.PlaylistPage),
  {
    ssr: false,
  },
);
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export default function Playlist() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const playlistId = params.playlistId as string | null;
  if (!playlistId) {
    dispatch(editNotFoundType("PLAYLIST"));
    return router.push("/404-error");
  }
  return <PlaylistPage id={playlistId} />;
}
