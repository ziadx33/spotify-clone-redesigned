import { type ReactNode } from "react";
import { Sidebar } from "../components/sidebar";
import { ServerAppDataProvider } from "@/providers/server-app-data-provider";
import { Header } from "../components/header";
import { Tabs } from "../components/tabs/tabs";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-screen w-full overflow-hidden">
      <ServerAppDataProvider>
        <Sidebar />
        <div className="flex h-full w-[80%] flex-col overflow-hidden rounded-lg">
          <Header>
            <Tabs />
          </Header>
          <div className="flex-grow overflow-y-auto rounded-lg border-l border-t">
            {children}
          </div>
        </div>
      </ServerAppDataProvider>
    </main>
  );
}
