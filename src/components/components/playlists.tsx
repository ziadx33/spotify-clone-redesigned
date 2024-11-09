"use client";

import { usePlaylists } from "@/hooks/use-playlists";
import { useSession } from "@/hooks/use-session";
import { LibraryItem } from "./library-item";
import { useFollowing } from "@/hooks/use-following";
import { LibraryItemSkeleton } from "../artist/components/skeleton";
import { useQueue } from "@/hooks/use-queue";
import { AuthorContext } from "../contexts/author-context";
import { PlaylistContext } from "../contexts/playlist-context";
import { type $Enums } from "@prisma/client";

type PlaylistsProps = {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  currentCategory: $Enums.CATEGORIES | null | undefined;
};

export function Playlists({ currentCategory }: PlaylistsProps) {
  const {
    data: { status: playlistsStatus, data: playlists, error },
  } = usePlaylists();
  const {
    status: followingStatus,
    data: following,
    error: err,
  } = useFollowing();
  const { data } = useSession();
  const {
    data: { data: queueListData },
    getQueue,
  } = useQueue();
  const currentQueue = getQueue(queueListData?.queueList.currentQueueId);
  if ([error, err].includes("error")) return <h1>{error}</h1>;
  return (
    <div className="flex flex-col gap-1">
      {![playlistsStatus, followingStatus].includes("loading") ? (
        <>
          {currentCategory !== "Artists"
            ? playlists
                ?.filter((playlist) =>
                  currentCategory === "Albums"
                    ? playlist.creatorId !== data?.user?.id
                    : true,
                )
                .map((playlist) => (
                  <PlaylistContext
                    playlist={playlist}
                    asChild={false}
                    key={playlist.id}
                  >
                    <LibraryItem
                      isActive={
                        !currentQueue?.artistTypeData
                          ? currentQueue?.playlistTypeData?.id === playlist.id
                          : false
                      }
                      type="PLAYLIST"
                      userData={data?.user}
                      data={playlist}
                    />
                  </PlaylistContext>
                ))
            : undefined}
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */}
          {!["Playlists", "Albums"].includes(currentCategory ?? "")
            ? following?.map((user) => {
                return (
                  <AuthorContext
                    asChild={false}
                    key={user.id}
                    artist={user}
                    playlistId="library"
                  >
                    <LibraryItem
                      isActive={
                        !currentQueue?.playlistTypeData
                          ? currentQueue?.playlistTypeData?.id === user.id
                          : false
                      }
                      type="ARTIST"
                      userData={data?.user}
                      data={user}
                      imageClassNames="rounded-full"
                    />
                  </AuthorContext>
                );
              })
            : undefined}
        </>
      ) : (
        <LibraryItemSkeleton amount={5} />
      )}
    </div>
  );
}
