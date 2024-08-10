"use client";

import { usePlaylist } from "@/hooks/use-playlist";
import { useSession } from "@/hooks/use-session";
import { useQuery } from "@tanstack/react-query";
import { MusicPlayer } from "./components/music-player";
import { useTracks } from "@/hooks/use-tracks";
import { EditableData } from "./components/editable-data";
import { MoreAlbums } from "./components/more-albums";
import { getUserById } from "@/server/actions/verification-token";
import { getPlaylists } from "@/server/actions/playlist";
import { Recommended } from "./components/recommended";

export function Playlist({ id }: { id: string }) {
  const { data } = usePlaylist(id);
  const { data: userData, status } = useSession();
  const { data: creatorData } = useQuery({
    queryKey: [`creator-data-${data?.creatorId}-${id}`],
    queryFn: async () => {
      if (!data?.creatorId) return null;
      if (data?.creatorId === userData?.user?.id)
        return { creatorData: userData?.user, playlists: [] };
      const res = await getUserById({ id: data.creatorId });
      const { data: playlists } = await getPlaylists({
        creatorId: res?.id ?? "",
        playlistIds: [],
      });
      return { creatorData: res, playlists: playlists! };
    },
    enabled: !!data?.creatorId && status === "authenticated",
  });

  const { data: tracks } = useTracks();
  const type = userData?.user?.id === data?.creatorId ? "Playlist" : "Album";
  return (
    <div className="flex h-fit min-h-full w-full flex-col">
      <EditableData
        creatorData={creatorData?.creatorData}
        data={data}
        tracks={tracks?.tracks ?? []}
        type={type}
      />
      <div className="flex h-fit w-full flex-col gap-4 px-8 pb-4">
        <MusicPlayer playlist={data} id={id} />
        {type === "Album" ? (
          <MoreAlbums
            artist={creatorData?.creatorData}
            playlist={data}
            data={creatorData?.playlists}
          />
        ) : (
          <Recommended
            playlistId={id}
            tracks={tracks?.tracks}
            playlist={data}
            artists={tracks?.authors}
          />
        )}
      </div>
    </div>
  );
}
