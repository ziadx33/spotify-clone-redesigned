"use client";

import { PrefrencesProvider } from "./components/prefrences-provider";
import Loading from "../ui/loading";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useUserData } from "@/hooks/use-user-data";

export function Home() {
  const user = useUserData();
  const router = useRouter();

  const content = useMemo(() => {
    if (!user?.id) return <Loading />;

    return <PrefrencesProvider userId={user.id} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (user && !user?.id) {
    router.push("/login");
    return null;
  }

  return <div className="flex flex-col px-4 pb-4">{content}</div>;
}
