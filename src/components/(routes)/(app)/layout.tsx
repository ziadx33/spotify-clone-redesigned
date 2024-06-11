import { type ReactNode } from "react";
import { Sidebar } from "./components/sidebar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-screen w-screen">
      <Sidebar />
      <div className="h-full w-full">{children}</div>
    </main>
  );
}
