import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChildrenContainer } from "./children-container";
import { Sidebar } from "@/components/components/sidebar/sidebar";
import { Header } from "@/components/components/header/header";
import { Tabs } from "@/components/components/tabs/tabs";
import { type ReactNode } from "react";

export function ResizeableContent({ children }: { children: ReactNode }) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="w-fit" defaultSize={20}>
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle className="bg-transparent" />
      <ResizablePanel>
        <div className="flex h-full w-full flex-col overflow-hidden rounded-lg">
          <Header>
            <Tabs />
          </Header>
          <ChildrenContainer>{children}</ChildrenContainer>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
