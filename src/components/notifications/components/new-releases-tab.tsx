import { useUpdateUser } from "@/hooks/use-update-user";
import { type RootState } from "@/state/store";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getTracksByPlaylistId } from "@/server/actions/track";
import Loading from "@/components/ui/loading";
import { Album } from "@/components/artist/components/tabs/albums-tab/components/album";
import { Separator } from "@/components/ui/separator";

export function NewReleasesTab() {
  const notifications = useSelector((state: RootState) => state.notifications);
  const { update: updateUser, user } = useUpdateUser();
  const isDone = useRef(false);
  useEffect(() => {
    if (!notifications.data) return;
    if (isDone.current) return;
    void updateUser({
      data: {
        seenNotifications: notifications.data
          .filter(
            (notification) => !user.seenNotifications.includes(notification.id),
          )
          .map((item) => item.id),
      },
    });
    isDone.current = true;
  }, [notifications.data, updateUser, user.seenNotifications]);
  const { data } = useQuery({
    queryKey: ["notifications-data"],
    queryFn: async () => {
      const { data: playlists } = await getTracksByPlaylistId(
        notifications.data!.map((notification) => notification.playlistId),
        undefined,
        true,
      );
      return playlists;
    },
    enabled: !!notifications,
  });
  return (
    <div className="container mx-auto p-8">
      <div className="mb-10 flex flex-col">
        <h1 className="text-3xl font-bold">What&apos;s New</h1>
        <p className="text-muted-foreground">
          The latest releases from artists you follow.
        </p>
        <Separator className="mt-4" />
      </div>
      <div className="flex flex-col gap-4">
        {data ? (
          data?.albums?.map((album) => (
            <Album
              viewAs="list"
              artist={data?.authors?.find(
                (artist) => album.creatorId === artist.id,
              )}
              key={album.id}
              album={album}
              addType
              tracks={
                data?.tracks?.filter((track) => track.albumId === album.id) ??
                []
              }
            />
          ))
        ) : (
          <Loading className="h-fit" />
        )}
      </div>
    </div>
  );
}
