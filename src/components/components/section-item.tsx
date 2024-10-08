"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FaPause, FaPlay } from "react-icons/fa";
import {
  type Playlist,
  type User,
  type TAB_TYPE,
  type Track,
} from "@prisma/client";
import { Navigate } from "../navigate";
import { type ReactNode } from "react";
import { type useIntersectionObserver } from "usehooks-ts";
import { type useNavigate } from "@/hooks/use-navigate";
import { AvatarData } from "../avatar-data";
import { QueuePlayButton } from "../queue-play-button";

export type NavigateClickParams<T extends string = ""> = (
  data: Omit<Parameters<typeof useNavigate>[0] & { image: string }, T>,
) => Promise<void> | void;

type SectionItem = {
  image?: string;
  alt?: string;
  showPlayButton?: boolean;
  title: string;
  description?: string;
  link?: string;
  imageClasses?: string;
  type?: TAB_TYPE | "TRACK";
  ref?: ReturnType<typeof useIntersectionObserver>["ref"] | null;
  onClick?: NavigateClickParams;
  customImage?: ReactNode;
  customElement?: ReactNode;
  playlistData?: Playlist;
  artistData?: User;
  trackData?: Track;
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
  onClick,
  customImage,
  customElement,
  playlistData,
  artistData,
  trackData,
}: SectionItem) {
  const content = (
    <>
      <div className="relative mb-1 size-[212.062px] overflow-hidden">
        {!customImage ? (
          <AvatarData
            containerClasses={cn("size-full rounded-sm", imageClasses)}
            src={image}
            alt={alt}
            title={title}
          />
        ) : (
          customImage
        )}
        {showPlayButton && (
          <QueuePlayButton
            isDiv
            playlist={playlistData}
            artist={artistData}
            track={trackData}
            className={cn(
              buttonVariants({ variant: "default", size: "icon" }),
              "absolute -bottom-20 right-2 z-20 h-16 w-16 rounded-full opacity-0 transition-all duration-200 hover:bg-primary group-hover:bottom-2 group-hover:opacity-100",
            )}
          >
            {(isPlaying) =>
              !isPlaying ? <FaPlay size={20} /> : <FaPause size={20} />
            }
          </QueuePlayButton>
        )}
        {customElement}
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="capitalize text-muted-foreground">{description}</p>
        )}
      </div>
    </>
  );
  const containerClasses = cn(
    "flex w-[236.062px] flex-col p-[12px] text-start",
    description ? "h-[295.078px]" : "h-fit",
  );
  return (
    <Card
      ref={ref}
      className="group border-none bg-transparent p-0 transition-colors hover:bg-muted"
    >
      {link ? (
        <CardContent className="p-0">
          <Navigate
            onClick={onClick}
            image={image}
            data={{
              href: link,
              title: title ?? "unknown",
              type: type === "TRACK" ? "PLAYLIST" : type,
            }}
            className={containerClasses}
            href={link}
          >
            {content}
          </Navigate>
        </CardContent>
      ) : onClick ? (
        <button className={containerClasses}>{content}</button>
      ) : (
        <div className={containerClasses}>{content}</div>
      )}
    </Card>
  );
}
