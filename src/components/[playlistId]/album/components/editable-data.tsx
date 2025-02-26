"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { type User, type Playlist } from "@prisma/client";
import { useMemo, memo, type ReactNode } from "react";
import { FaCircle } from "react-icons/fa";
import Image from "next/image";
import { getTime } from "@/utils/get-time";
import { format } from "date-fns";
import { useTracks } from "@/hooks/use-tracks";
import { Badge } from "@/components/ui/badge";
import { enumParser } from "@/utils/enum-parser";
import {
  SkeletonAuthorList,
  SkeletonList,
} from "@/components/artist/components/skeleton";
import { Author } from "./author";
import { useMiniMenu } from "@/hooks/use-mini-menu";
import { cn } from "@/lib/utils";
import { AuthorContext } from "@/components/contexts/author-context";
import { PlaylistContext } from "@/components/contexts/playlist-context";
import { useIsMobile } from "@/hooks/use-mobile";

type EditableDataProps = {
  data?: Playlist | null;
  creatorData?: User | null;
  children: ReactNode;
};

function EditableDataComp({ data, creatorData, children }: EditableDataProps) {
  const isLoading = !data;
  const {
    data: { data: tracksData, status },
  } = useTracks();

  const tracksTime = useMemo(() => {
    const seconds = tracksData?.tracks
      ?.map((track) => track.duration)
      .reduce((a, b) => a + b, 0);
    return getTime(seconds ?? 0);
  }, [tracksData?.tracks]);

  const isDoneLoading =
    !isLoading && !!data && !!creatorData && status !== "loading";
  const isMobile = useIsMobile();

  const { value: miniMenuValue } = useMiniMenu();
  const split = miniMenuValue || isMobile;

  return (
    <div>
      <div
        className={cn(
          "flex justify-between gap-8 p-8 pb-6 max-lg:p-5",
          split ? "flex-col" : "",
        )}
      >
        <div className="flex w-[95%] flex-col">
          <PlaylistContext playlist={data}>
            <h1
              title={data?.title}
              className="mb-5 line-clamp-1 overflow-visible text-start text-6xl font-bold max-lg:text-2xl"
            >
              {isDoneLoading ? (
                data?.title
              ) : (
                <Skeleton className="mb-4 h-24 w-96" />
              )}
            </h1>
          </PlaylistContext>
          <div className="flex gap-1.5">
            {isDoneLoading ? (
              <span className="flex items-center gap-1.5">
                {creatorData && data ? (
                  <AuthorContext artist={creatorData} playlistId={data.id}>
                    <span>{creatorData.name}</span>
                  </AuthorContext>
                ) : (
                  creatorData?.name
                )}
                {(tracksData?.tracks?.length ?? 0) > 0 && (
                  <>
                    <FaCircle size="5" className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {format(new Date(data.createdAt), "YYY")}
                    </span>
                    <FaCircle size="5" className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {tracksData?.tracks?.length} tracks{" "}
                    </span>
                    <FaCircle size="5" className="text-muted-foreground" />
                    <span className="text-muted-foreground">{tracksTime}</span>
                  </>
                )}
              </span>
            ) : (
              <Skeleton className="my-auto h-2.5 w-36" />
            )}
          </div>
          {children}
        </div>
        <div
          className={cn(
            "flex w-fit gap-4 max-lg:flex-col",
            !split ? "flex-col" : "w-full flex-row border-t pt-4",
          )}
        >
          <div
            className={cn(
              "group relative max-lg:h-[400px] max-lg:w-full",
              !split ? "size-[500px]" : "size-[300px]",
            )}
          >
            {isDoneLoading ? (
              <Image
                src={data?.imageSrc ?? ""}
                fill
                draggable="false"
                alt={data?.title ?? ""}
                className="rounded-md"
              />
            ) : (
              <Skeleton className="size-full" />
            )}
          </div>
          <div
            className={cn(
              "flex gap-4",
              !split ? "mb-auto flex-col-reverse" : "flex-col",
            )}
          >
            {data?.genres && (
              <div className="flex flex-wrap gap-1">
                {isDoneLoading ? (
                  (data?.genres as string[]).map((genre) => (
                    <Badge
                      key={genre}
                      className="text-md px-4 py-1"
                      variant="outline"
                    >
                      {enumParser(genre)}
                    </Badge>
                  ))
                ) : (
                  <>
                    <SkeletonList
                      amount={5}
                      className="h-8 w-20 rounded-full"
                    />
                  </>
                )}
              </div>
            )}
            <div className="flex flex-col gap-4">
              {isDoneLoading ? (
                tracksData?.authors?.map((author) => (
                  <Author key={author.id} author={author} playlist={data} />
                ))
              ) : (
                <SkeletonAuthorList amount={5} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const EditableData = memo(EditableDataComp);
