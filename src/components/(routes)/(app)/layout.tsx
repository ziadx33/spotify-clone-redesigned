import { type ReactNode } from "react";
import { Sidebar } from "./components/sidebar";
import { ServerAppDataProvider } from "@/providers/server-app-data-provider";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-screen w-screen">
      <ServerAppDataProvider>
        <Sidebar />
        <div className="h-full w-full">{children}</div>
      </ServerAppDataProvider>
    </main>
  );
}
