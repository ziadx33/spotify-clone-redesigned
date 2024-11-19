"use client";

import { useUpdateUser } from "@/hooks/use-update-user";
import { type RootState } from "@/state/store";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Album } from "../artist/components/tabs/albums-tab/components/album";
import { Separator } from "../ui/separator";

export function Notifications() {
  const notifications = useSelector((state: RootState) => state.notifications);
  const { update: updateUser } = useUpdateUser();
  const isDone = useRef(false);
  useEffect(() => {
    if (!notifications.data) return;
    if (isDone.current) return;
    void updateUser({
      data: {
        seenNotifications: notifications.data.map((item) => item.id),
      },
    });
    isDone.current = true;
  }, [notifications.data, updateUser]);
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
        {notifications.notificationsData?.albums?.map((album) => (
          <Album
            viewAs="list"
            artist={notifications.notificationsData?.authors?.find(
              (artist) => album.creatorId === artist.id,
            )}
            key={album.id}
            album={album}
            addType
            tracks={
              notifications?.notificationsData?.tracks?.filter(
                (track) => track.albumId === album.id,
              ) ?? []
            }
          />
        ))}
      </div>
    </div>
  );
}
