/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState, type ComponentPropsWithoutRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAvatarFallback } from "@/utils/get-avatar-fallback";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

type AvatarData = {
  title?: string | null;
  containerClasses?: string;
} & ComponentPropsWithoutRef<"img">;

export function AvatarData({
  containerClasses,
  title,
  alt,
  ...restProps
}: AvatarData) {
  const fallback = useMemo(() => {
    return getAvatarFallback(title ?? alt);
  }, [title, alt]);

  const [showImage, setShowImage] = useState(false);
  return (
    <Avatar className={cn("relative", containerClasses)}>
      {!showImage && (
        <Skeleton
          {...restProps}
          className={cn(
            "absolute left-0 top-0 z-10 size-full",
            restProps.className,
          )}
        />
      )}
      <AvatarImage
        draggable={false}
        {...restProps}
        className={showImage ? restProps.className : "invisible"}
        onLoadingStatusChange={() => setShowImage(true)}
      />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
