"use client";

import { useSession } from "@/hooks/use-session";
import { ThemeProvider } from "next-themes";
import { useMemo, type ReactNode } from "react";

export function UserThemeProvider({ children }: { children: ReactNode }) {
  const { data } = useSession();
  const content = useMemo(() => {
    return children;
  }, [children]);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      forcedTheme={data?.user?.theme.toLowerCase()}
      disableTransitionOnChange
    >
      {content}
    </ThemeProvider>
  );
}
