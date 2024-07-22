"use client";

import Loading from "@/app/(routes)/(app)/loading";
import { Suspense, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Loading />}>
      {" "}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Suspense>
  );
}
