"use client";

import Loading from "@/components/ui/loading";
import { usePlaylist } from "@/hooks/use-playlist";
import { useSession } from "@/hooks/use-session";
import { getUserById } from "@/server/actions/user";
import { type Playlist } from "@prisma/client";
import Image from "next/image";
import { FaCircle } from "react-icons/fa";
import { useQuery } from "react-query";
import { MusicPlayer } from "./components/music-player";
import { useTracks } from "@/hooks/use-tracks";

export function Playlist({ id }: { id: string }) {
  const { data } = usePlaylist(id);
  const { data: userData } = useSession();
  const { data: creatorData, isLoading: creatorDataLoading } = useQuery(
    `creatorId-${data?.creatorId}`,
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const res = await getUserById(data?.creatorId ?? "");
      return res;
    },
  );
  const { data: tracks } = useTracks({ albumId: id });
  if (creatorDataLoading) return <Loading />;
  const type = userData?.user?.id === data?.creatorId ? "Playlist" : "Album";
  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-fit w-full border-b">
        <div className="flex h-fit w-full gap-8 p-8 pb-6">
          <div className="relative h-[288px] w-[288px]">
            <Image
              src={data?.imageSrc ?? ""}
              fill
              draggable="false"
              alt={data?.title ?? ""}
              className="rounded-md"
            />
          </div>
          <div className="flex flex-col pt-[6.2rem]">
            <h3 className="mb-4">{type}</h3>
            <h1
              title={data?.title}
              className="mb-5 line-clamp-1 text-8xl font-bold"
            >
              {data?.title}
            </h1>
            <div>
              {creatorData?.image && (
                <Image
                  width={20}
                  height={20}
                  draggable="false"
                  alt={creatorData?.name ?? ""}
                  src={creatorData?.image ?? ""}
                />
              )}
              <span className="flex items-center gap-1.5">
                {creatorData?.name}
                <FaCircle size="5" /> {tracks.tracks?.length} tracks
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-fit w-full px-8">
        <MusicPlayer playlist={data} id={id} />
      </div>
    </div>
  );
}
