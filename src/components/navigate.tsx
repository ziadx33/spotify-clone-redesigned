"use client";

import { type NavigateProps, useNavigate } from "@/hooks/use-navigate";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

export function Navigate({
  children,
  data,
  href,
  ...restProps
}: NavigateProps & {
  children: ReactNode;
} & ComponentPropsWithoutRef<"button">) {
  const navigate = useNavigate({ data, href });
  console.log("stop navigationg", href);
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button onClick={() => navigate()} {...restProps}>
          {children}
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => navigate(false)}>
          Open in new tab
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
