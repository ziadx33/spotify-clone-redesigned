"use client";

import { useUserData } from "@/hooks/use-user-data";
import { ThemeProvider } from "next-themes";
import { useMemo, type ReactNode } from "react";

export function UserThemeProvider({ children }: { children: ReactNode }) {
  const data = useUserData();
  const content = useMemo(() => {
    return children;
  }, [children]);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      forcedTheme={data?.theme?.toLowerCase()}
      disableTransitionOnChange
    >
      {content}
    </ThemeProvider>
  );
}
