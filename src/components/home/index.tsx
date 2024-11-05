"use client";

import { PrefrencesProvider } from "./components/prefrences-provider";
import Loading from "../ui/loading";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useMemo } from "react";

export function Home() {
  const { data: user } = useSession();
  const router = useRouter();

  const content = useMemo(() => {
    if (!user?.user?.id) return <Loading />;

    return <PrefrencesProvider userId={user.user.id} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user?.id]);

  if (user && !user?.user?.id) {
    router.push("/login");
    return null;
  }

  return <div className="flex flex-col px-4 pb-4">{content}</div>;
}
