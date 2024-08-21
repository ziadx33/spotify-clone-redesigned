"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FaPlay } from "react-icons/fa";
import { type TAB_TYPE } from "@prisma/client";
import { Navigate } from "../navigate";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getAvatarFallback } from "@/utils/get-avatar-fallback";
import { useMemo } from "react";
import { useIntersectionObserver } from "usehooks-ts";

type SectionItem = {
  image?: string;
  alt?: string;
  showPlayButton?: boolean;
  title: string;
  description: string;
  link: string;
  imageClasses?: string;
  type?: TAB_TYPE;
  ref?: ReturnType<typeof useIntersectionObserver>["ref"] | null;
};

export function SectionItem({
  image,
  alt,
  showPlayButton = false,
  title,
  description,
  link,
  imageClasses,
  type = "PLAYLIST",
  ref,
}: SectionItem) {
  const imageFallback = useMemo(() => getAvatarFallback(title), [title]);
  return (
    <Card
      ref={ref}
      className="group border-none bg-transparent p-0 transition-colors hover:bg-muted"
    >
      <CardContent className="p-0">
        <Navigate
          data={{
            href: link,
            title: title ?? "unknown",
            type: type,
          }}
          className="flex h-[295.078px] w-[236.062px] flex-col p-[12px] text-start"
          href={link}
        >
          <div className="relative mb-1 size-[212.062px] overflow-hidden">
            <Avatar
              className={cn("size-full rounded-sm object-cover", imageClasses)}
            >
              <AvatarImage src={image} alt={alt} className="object-cover" />
              <AvatarFallback className="text-6xl">
                {imageFallback}
              </AvatarFallback>
            </Avatar>
            {showPlayButton && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  buttonVariants({ variant: "default", size: "icon" }),
                  "absolute -bottom-20 right-2 h-16 w-16 rounded-full opacity-0 transition-all duration-200 hover:bg-primary group-hover:bottom-2 group-hover:opacity-100",
                )}
              >
                <FaPlay size={20} />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </Navigate>
      </CardContent>
    </Card>
  );
}
