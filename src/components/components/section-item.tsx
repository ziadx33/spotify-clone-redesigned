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
import { type ReactNode } from "react";
import { type useIntersectionObserver } from "usehooks-ts";
import { AvatarData } from "../avatar-data";
import { QueuePlayButton } from "../queue-play-button";
import { TrackContext } from "../contexts/track-context";
import { AuthorContext } from "../contexts/author-context";
import { PlaylistContext } from "../contexts/playlist-context";
import { useRouter } from "next/navigation";

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
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onClick?: () => unknown | Promise<unknown>;
  customImage?: ReactNode;
  customElement?: ReactNode;
  playlistData?: Playlist;
  artistData?: User;
  trackData?: Track;
  noDefPlaylist?: boolean;
  disableContext?: boolean;
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
  noDefPlaylist = true,
  disableContext = false,
}: SectionItem) {
  const router = useRouter();
  const content = (
    <>
      <div className="section-item max-lg:[] relative mb-1 size-[212.062px] overflow-hidden">
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
            noDefPlaylist={noDefPlaylist}
            playlist={playlistData}
            artist={artistData}
            track={trackData}
            className={(isPlaying, queuePlaying) =>
              cn(
                buttonVariants({ variant: "default", size: "icon" }),
                cn(
                  "absolute -bottom-20 right-2 z-20 h-16 w-16 cursor-pointer rounded-full opacity-0 transition-all duration-200 hover:scale-105 hover:bg-primary",
                  isPlaying && queuePlaying
                    ? "bottom-2 opacity-100"
                    : "group-hover:bottom-2 group-hover:opacity-100",
                ),
              )
            }
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
  const cardContent = (
    <Card
      ref={ref}
      onClick={onClick}
      className="group cursor-pointer border-none bg-transparent p-0 transition-colors hover:bg-muted"
    >
      {link ? (
        <CardContent className={containerClasses}>{content}</CardContent>
      ) : onClick ? (
        <button className={containerClasses}>{content}</button>
      ) : (
        <div className={containerClasses}>{content}</div>
      )}
    </Card>
  );
  const children = !disableContext ? (
    type === "TRACK" ? (
      <TrackContext track={trackData}>
        <button
          onClick={() => router.push(link ?? `/playlist/${trackData?.albumId}`)}
          className="hover:no-underline"
        >
          {cardContent}
        </button>
      </TrackContext>
    ) : type === "ARTIST" ? (
      <AuthorContext artist={artistData} playlistId="section-item">
        <button
          onClick={() =>
            router.push(link ?? `/artist/${artistData?.id}?playlist=unknown`)
          }
          className="hover:no-underline"
        >
          {cardContent}
        </button>
      </AuthorContext>
    ) : type === "PLAYLIST" ? (
      <PlaylistContext playlist={playlistData}>
        <button
          onClick={() => router.push(link ?? `/playlist/${playlistData?.id}`)}
          className="hover:no-underline"
        >
          {cardContent}
        </button>
      </PlaylistContext>
    ) : (
      link && <button onClick={() => router.push(link)}>{cardContent}</button>
    )
  ) : (
    cardContent
  );
  return children;
}
