"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { type ReactNode } from "react";

export function MobileProvider({
  childrenAction,
}: {
  childrenAction: (isMobile: boolean) => ReactNode;
}) {
  const isMobile = useIsMobile();
  return childrenAction(isMobile);
}
