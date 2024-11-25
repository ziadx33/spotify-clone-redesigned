"use client";

import Loading from "@/components/ui/loading";
import { useSession } from "@/hooks/use-session";
import { createPrefrence, getPrefrence } from "@/server/actions/prefrence";
import { setPrefrence } from "@/state/slices/prefrence";
import { type AppDispatch } from "@/state/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { useDispatch } from "react-redux";

export function PrefrencesProvider({ children }: { children: ReactNode }) {
  const { data: user } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  const { data, status } = useQuery({
    queryKey: ["home-prefrences-get", user?.user?.id],
    queryFn: async () => {
      if (!user?.user?.id) throw new Error("User not authenticated");
      let userPrefrence = await getPrefrence(user.user.id);
      if (!userPrefrence.data)
        userPrefrence = await createPrefrence(user.user.id);
      return userPrefrence;
    },
    enabled: !!user?.user?.id,
  });

  useEffect(() => {
    if (data) dispatch(setPrefrence(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  console.log(status);

  return status === "success" ? children : <Loading />;
}
