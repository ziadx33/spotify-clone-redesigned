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
  asChild,
  ...restProps
}: NavigateProps & {
  children: ReactNode;
  asChild?: boolean;
} & ComponentPropsWithoutRef<"button">) {
  const navigate = useNavigate({ data, href });
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button onClick={() => navigate()} {...restProps}>
          {children}
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => navigate(undefined, undefined, false)}>
          Open in new tab
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
