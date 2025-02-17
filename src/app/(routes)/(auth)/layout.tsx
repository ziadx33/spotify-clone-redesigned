import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="grid h-screen w-full place-items-center">
      <Card className="w-[80%] md:w-[50%] xl:w-[25%]">{children}</Card>
    </main>
  );
}
