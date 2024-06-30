"use client";

import { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
