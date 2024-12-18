import { type ReactNode } from "react";
import { ServerAppDataProvider } from "@/providers/server-app-data-provider";
import { QueueControllerContainer } from "./components/queue-controller-container";
import { AudiosProvider } from "@/providers/audios-provider";
import { PrefrencesProvider } from "@/providers/prefrences-provider";
import { ResizeableContent } from "./components/resizable-content";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <PrefrencesProvider>
      <main className="flex h-screen w-screen overflow-hidden">
        <ServerAppDataProvider>
          <AudiosProvider>
            <QueueControllerContainer>
              <ResizeableContent>{children}</ResizeableContent>
            </QueueControllerContainer>
          </AudiosProvider>
        </ServerAppDataProvider>
      </main>
    </PrefrencesProvider>
  );
}
