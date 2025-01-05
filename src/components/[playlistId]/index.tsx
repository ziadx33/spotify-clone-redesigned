"use client";

import { usePlaylist } from "@/hooks/use-playlist";
import { useQuery } from "@tanstack/react-query";
import { useTracks } from "@/hooks/use-tracks";
import { getUserById } from "@/server/actions/verification-token";
import { getPlaylists } from "@/server/actions/playlist";
import { type Playlist as PlaylistType, type User } from "@prisma/client";
import { Album } from "./album";
import { Playlist } from "./playlist";
import { useUserData } from "@/hooks/use-user-data";

export type PlaylistPageProps = {
  creatorData?: {
    creatorData: User | null;
    playlists: PlaylistType[];
  } | null;
  type: string;
  tracks?: ReturnType<typeof useTracks>["data"];
  data?: PlaylistType | null;
  id: string;
};

export function PlaylistPage({ id }: { id: string }) {
  const { data } = usePlaylist(id);
  const userData = useUserData();
  const { data: creatorData } = useQuery({
    queryKey: [`creator-data-${data?.creatorId}-${id}`],
    queryFn: async () => {
      if (!data?.creatorId) return null;
      if (data?.creatorId === userData?.id)
        return { creatorData: userData, playlists: [] };
      const res = await getUserById({ id: data.creatorId });
      const { data: playlists } = await getPlaylists({
        creatorId: res?.id ?? "",
        playlistIds: [],
        excludedIds: [id],
      });
      return { creatorData: res, playlists: playlists! };
    },
    enabled: !!data?.creatorId,
  });

  const { data: tracks } = useTracks();
  const type = data?.type ?? "PLAYLIST";
  const props: PlaylistPageProps = {
    id,
    type,
    creatorData,
    data,
    tracks,
  };
  return type === "PLAYLIST" ? <Playlist {...props} /> : <Album {...props} />;
}
