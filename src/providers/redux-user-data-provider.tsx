"use client";

import Loading from "@/components/ui/loading";
import { useSession } from "@/hooks/use-session";
import { editUserData } from "@/state/slices/user";
import { type AppDispatch } from "@/state/store";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDispatch } from "react-redux";

export function ReduxUserDataProvider({ children }: { children: ReactNode }) {
  const { data: user, status } = useSession();
  const [isLoading, setIsLoading] = useState(
    status === "unauthenticated" ? false : true,
  );
  const isDone = useRef(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!user?.user) return;
    if (isDone.current) return;
    dispatch(editUserData(user.user));
    setIsLoading(false);
    isDone.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user]);

  return !isLoading ? children : <Loading />;
}
