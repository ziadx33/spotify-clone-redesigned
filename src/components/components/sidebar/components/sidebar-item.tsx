import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type ReactNode } from "react";

type SidebarItemProps = {
  href: string;
  active: boolean;
  children: ReactNode;
};

export function SidebarItem({ href, active, children }: SidebarItemProps) {
  return (
    <Button
      variant={!active ? "ghost" : "secondary"}
      className="h-fit w-full justify-start gap-2"
      asChild
    >
      <Link href={href} className="hover:no-underline">
        {children}
      </Link>
    </Button>
  );
}
