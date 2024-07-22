import { type ReactNode } from "react";
import { Sidebar } from "../components/sidebar";
import { ServerAppDataProvider } from "@/providers/server-app-data-provider";
import { Header } from "../components/header";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-screen w-screen">
      <ServerAppDataProvider>
        <Sidebar />
        <div className="size-full pl-[20%]">
          <Header />
          {children}
        </div>
      </ServerAppDataProvider>
    </main>
  );
}
