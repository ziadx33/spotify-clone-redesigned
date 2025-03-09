"use client";

import Loading from "@/components/ui/loading";
import { useSession } from "@/hooks/use-session";
import { getUser } from "@/server/queries/user";
import { editUserData } from "@/state/slices/user";
import { type AppDispatch } from "@/state/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";

export function ReduxUserDataProvider({ children }: { children: ReactNode }) {
  const { data: user, status } = useSession();
  const { data: userData } = useQuery({
    queryKey: [`user-${user?.user?.id}`],
    queryFn: async () => {
      return getUser({ id: user?.user?.id });
    },
    enabled: !!user?.user,
  });
  const [isLoading, setIsLoading] = useState(true);
  const isDone = useRef(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === "loading") return;
    setIsLoading(status !== "unauthenticated");
  }, [status]);
  useEffect(() => {
    if (!userData) return;
    if (isDone.current) return;
    dispatch(editUserData(userData));
    setIsLoading(false);
    isDone.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return !isLoading ? children : <Loading />;
}
