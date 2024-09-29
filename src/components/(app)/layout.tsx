import { type ReactNode } from "react";
import { Sidebar } from "../components/sidebar";
import { ServerAppDataProvider } from "@/providers/server-app-data-provider";
import { QueueControllerContainer } from "./components/queue-controller-container";
import { Tabs } from "../components/tabs/tabs";
import { Header } from "../components/header";
import { ChildrenContainer } from "./components/children-container";
import { AudiosProvider } from "@/providers/audios-provider";

export function Layout({ children }: { children: ReactNode }) {
  console.log("sahla w mesh mestahla");
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <ServerAppDataProvider>
        <AudiosProvider>
          <QueueControllerContainer>
            <Sidebar />
            <div className="flex h-full w-[80%] flex-col overflow-hidden rounded-lg">
              <Header>
                <Tabs />
              </Header>
              <ChildrenContainer>{children}</ChildrenContainer>
            </div>
          </QueueControllerContainer>
        </AudiosProvider>
      </ServerAppDataProvider>
    </main>
  );
}
