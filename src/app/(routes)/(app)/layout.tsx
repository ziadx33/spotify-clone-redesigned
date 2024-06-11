import { Layout } from "@/components/(routes)/(app)/layout";
import { type ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
