"use client";

import Loading from "@/components/ui/loading";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

function Provider({ children }: AuthProviderProps) {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!data?.user) router.push("/login");
    else router.push("/home");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "loading") return <Loading />;
  return children;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <SessionProvider>
    <Provider>{children}</Provider>
  </SessionProvider>
);
