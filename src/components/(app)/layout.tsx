import { type ReactNode } from "react";
import { Sidebar } from "../components/sidebar/sidebar";
import { ServerAppDataProvider } from "@/providers/server-app-data-provider";
import { QueueControllerContainer } from "./components/queue-controller-container";
import { Tabs } from "../components/tabs/tabs";
import { ChildrenContainer } from "./components/children-container";
import { AudiosProvider } from "@/providers/audios-provider";
import { PrefrencesProvider } from "@/providers/prefrences-provider";
import { Header } from "../components/header/header";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <PrefrencesProvider>
      <main className="flex h-screen w-screen overflow-hidden">
        <ServerAppDataProvider>
          <AudiosProvider>
            <QueueControllerContainer>
              <Sidebar />
              <div className="flex h-full w-full flex-col overflow-hidden rounded-lg">
                <Header>
                  <Tabs />
                </Header>
                <ChildrenContainer>{children}</ChildrenContainer>
              </div>
            </QueueControllerContainer>
          </AudiosProvider>
        </ServerAppDataProvider>
      </main>
    </PrefrencesProvider>
  );
}
