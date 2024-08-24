"use client";

import { type NavigateProps, useNavigate } from "@/hooks/use-navigate";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { type NavigateClickParams } from "./components/section-item";

export function Navigate({
  children,
  data,
  href,
  onClick,
  image,
  ...restProps
}: NavigateProps & {
  children: ReactNode;
  onClick?: NavigateClickParams;
  image?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">) {
  const navigate = useNavigate({ data, href });
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          onClick={async () => {
            await onClick?.({ data, href, image: image ?? "" });
            navigate();
          }}
          {...restProps}
        >
          {children}
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => navigate.apply({}, [, , false])}>
          Open in new tab
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
