"use client";

import Loading from "@/components/ui/loading";
import { useUserData } from "@/hooks/use-user-data";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const user = useUserData();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (user.type !== "ARTIST") router.push("/");
    else setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.type]);
  return !isLoading ? children : <Loading />;
}
