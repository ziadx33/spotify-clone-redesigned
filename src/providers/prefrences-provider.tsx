"use client";

import Loading from "@/components/ui/loading";
import { useUserData } from "@/hooks/use-user-data";
import { createPrefrence } from "@/server/actions/prefrence";
import { getPrefrence } from "@/server/queries/prefrence";
import { setPrefrence } from "@/state/slices/prefrence";
import { type AppDispatch } from "@/state/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { useDispatch } from "react-redux";

export function PrefrencesProvider({ children }: { children: ReactNode }) {
  const user = useUserData();
  const dispatch = useDispatch<AppDispatch>();

  const { data, status } = useQuery({
    queryKey: ["home-prefrences-get", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      let userPrefrence = await getPrefrence(user?.id);
      if (!userPrefrence.data) {
        const newPrefrence = await createPrefrence(user?.id);
        userPrefrence = {
          status: "success",
          data: newPrefrence.data!,
          error: null,
        };
      }
      return userPrefrence;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (data) {
      dispatch(setPrefrence(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return status === "success" ? children : <Loading />;
}
