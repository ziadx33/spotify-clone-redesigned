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
      console.log("zero goooo");
      void dispatch(getSliceNotifications(user.id));
      void dispatch(getSliceQueue(user.id));
      void dispatch(getSliceFolders(user.id));
      await dispatch(getSliceRequests(user.id));
      isDone.current = true;
    };
    void fn();
  }, [dispatch, user?.id]);

  const content = useMemo(() => {
    return children;
  }, [children]);

  return content;
}
