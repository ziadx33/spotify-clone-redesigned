import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { type ReactNode } from "react";

type SidebarItemProps = {
  href?: string;
  active?: boolean;
  children: ReactNode;
  className?: string;
} & ButtonProps;

export function SidebarItem({
  href,
  active,
  children,
  className,
  ...restProps
}: SidebarItemProps) {
  return (
    <Button
      variant={!active ? "ghost" : "secondary"}
      className={cn("h-fit w-full justify-start gap-2", className)}
      asChild
      {...restProps}
    >
      {href ? (
        <Link href={href} className="hover:no-underline">
          {children}
        </Link>
      ) : (
        children
      )}
    </Button>
  );
}
