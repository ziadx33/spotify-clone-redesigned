"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const Client = dynamic(
  () => import("@/components/[clientId]").then((file) => file.Client),
  {
    ssr: false,
  },
);

export default function ClientProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const content = useMemo(() => {
    const playlistId = searchParams.get("playlist");
    const userId = pathname.split("/")[2];
    if (!userId) {
      router.push("/");
      return null;
    }
    return <Client playlistId={playlistId} artistId={userId} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return content;
}
