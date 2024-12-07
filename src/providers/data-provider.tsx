"use client";

import { useSession } from "@/hooks/use-session";
import { getNotificationsByUserId } from "@/server/actions/notification";
import { getQueue } from "@/server/actions/queue";
import { getTracksByPlaylistId } from "@/server/actions/track";
import { setNotificationsData } from "@/state/slices/notifications";
import { setQueue } from "@/state/slices/queue-list";
import { type AppDispatch } from "@/state/store";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useDispatch } from "react-redux";

export function DataProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSession();
  const isDone = useRef(false);
  useEffect(() => {
    if (!user?.user?.id) return;
    if (isDone.current) return;
    const fn = async () => {
      if (!user?.user?.id) return;
      const queueData = await getQueue(user?.user?.id);
      dispatch(setQueue(queueData));
      const notifications = await getNotificationsByUserId(user?.user?.id);
      const { data: playlists } = await getTracksByPlaylistId(
        notifications.map((notification) => notification.playlistId),
        undefined,
        true,
      );

      dispatch(
        setNotificationsData({
          data: notifications,
          notificationsData: playlists,
        }),
      );
      isDone.current = true;
    };
    void fn();
  }, [dispatch, user?.user?.id]);

  const content = useMemo(() => {
    return children;
  }, [children]);

  return content;
}
