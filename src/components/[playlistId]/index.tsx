"use client";

import Loading from "@/components/ui/loading";
import { usePlaylist } from "@/hooks/use-playlist";
import { useSession } from "@/hooks/use-session";
import { getUserById } from "@/server/actions/user";
import { type Playlist } from "@prisma/client";
import { useQuery } from "react-query";
import { MusicPlayer } from "./components/music-player";
import { useTracks } from "@/hooks/use-tracks";
import { EditableData } from "./components/editable-data";

export function Playlist({ id }: { id: string }) {
  const { data, status } = usePlaylist(id);
  const { data: userData } = useSession();
  const { data: creatorData, isLoading: creatorDataLoading } = useQuery(
    `creatorId-${data?.creatorId}`,
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (data?.creatorId === userData?.user?.id) return userData?.user;
      const res = await getUserById(data?.creatorId ?? "");
      return res;
    },
  );
  const { data: tracks } = useTracks({ albumId: id });
  if (creatorDataLoading || status === "loading") return <Loading />;
  const type = userData?.user?.id === data?.creatorId ? "Playlist" : "Album";
  return (
    <div className="flex h-full w-full flex-col pt-12">
      <EditableData
        creatorData={creatorData}
        data={data}
        tracks={tracks.tracks}
        type={type}
      />
      <div className="h-fit w-full px-8">
        <MusicPlayer playlist={data} id={id} />
      </div>
    </div>
  );
}
