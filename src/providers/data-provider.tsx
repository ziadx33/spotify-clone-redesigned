"use client";

import { useUserData } from "@/hooks/use-user-data";
import { getSliceFolders } from "@/state/slices/folders";
import { getSliceNotifications } from "@/state/slices/notifications";
import { getSliceQueue } from "@/state/slices/queue-list";
import { getSliceRequests } from "@/state/slices/requests";
import { type AppDispatch } from "@/state/store";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useDispatch } from "react-redux";

export function DataProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useUserData();
  const isDone = useRef(false);
  useEffect(() => {
    if (!user?.id) return;
    if (isDone.current) return;
    const fn = async () => {
      await dispatch(getSliceNotifications(user.id));
      await dispatch(getSliceQueue(user.id));
      await dispatch(getSliceRequests(user.id));
      await dispatch(getSliceFolders(user.id));
      isDone.current = true;
    };
    void fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const content = useMemo(() => {
    return children;
  }, [children]);

  return content;
}
