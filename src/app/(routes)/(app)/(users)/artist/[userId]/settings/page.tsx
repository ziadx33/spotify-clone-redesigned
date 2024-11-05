"use client";

import { Settings } from "@/components/settings";
import Loading from "@/components/ui/loading";
import { useSession } from "@/hooks/use-session";
import { redirect, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SettingsPage() {
  const params = useParams();
  const userId = params.userId;
  const { data: user } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const isDone = useRef(false);
  useEffect(() => {
    if (isDone.current) return;
    if (userId !== user?.user?.id) redirect("/");
    else {
      setIsLoading(false);
    }
    isDone.current = true;
  }, [user?.user?.id, userId]);

  return !isLoading && user?.user ? <Settings user={user.user} /> : <Loading />;
}
