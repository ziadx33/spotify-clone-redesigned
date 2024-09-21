"use client";

import { useSession } from "@/hooks/use-session";
import { getQueue } from "@/server/actions/queue";
import { setQueue } from "@/state/slices/queue-list";
import { type AppDispatch } from "@/state/store";
import { useEffect, useRef, type ReactNode } from "react";
import { useDispatch } from "react-redux";

export function QueueProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSession();
  const isDone = useRef(false);
  useEffect(() => {
    if (!user?.user?.id) return;
    if (isDone.current) return;
    const fn = async () => {
      const data = await getQueue(user?.user?.id ?? "");
      dispatch(setQueue(data));
      isDone.current = true;
    };
    void fn();
  }, [dispatch, user?.user?.id]);
  return children;
}
