"use client";

import { PrefrencesProvider } from "./components/prefrences-provider";
import { getPrefrence } from "@/server/actions/prefrence";
import { useQuery } from "@tanstack/react-query";
import Loading from "../ui/loading";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useMemo } from "react";

export function Home() {
  const { data: user } = useSession();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["home-prefrences-get", user?.user?.id],
    queryFn: async () => {
      if (!user?.user?.id) throw new Error("User not authenticated");
      const userPrefrence = await getPrefrence(user.user.id);
      return userPrefrence;
    },
    enabled: !!user?.user?.id,
  });

  console.log("broo", data);

  const content = useMemo(() => {
    if (isLoading || !user?.user?.id) return <Loading />;
    if (isError) throw error.message;

    return <PrefrencesProvider userId={user.user.id} data={data} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, isError]);

  if (user && !user?.user?.id) {
    router.push("/login");
    return null;
  }

  return <div className="flex flex-col px-4 pb-4">{content}</div>;
}
