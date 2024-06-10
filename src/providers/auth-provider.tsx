"use client";

import Loading from "@/components/ui/loading";
import { AUTH_ROUTES } from "@/constants";
import { useSession } from "@/hooks/use-session";
import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

function Provider({ children }: AuthProviderProps) {
  const { status, data } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isCurrentPathnameIsAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  useEffect(() => {
    if (!data?.user && !isCurrentPathnameIsAuthRoute) router.push("/login");
    else if (data?.user && isCurrentPathnameIsAuthRoute) router.push("/home");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isCurrentPathnameIsAuthRoute]);

  if (status === "loading") return <Loading />;
  return children;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <SessionProvider>
    <Provider>{children}</Provider>
  </SessionProvider>
);
