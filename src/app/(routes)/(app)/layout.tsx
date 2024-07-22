import { Layout } from "@/components/(app)/layout";
import { type ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
