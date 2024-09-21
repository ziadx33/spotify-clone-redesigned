"use client";

import { Navigate } from "@/components/navigate";
import { Skeleton } from "@/components/ui/skeleton";
import { type Playlist } from "@prisma/client";
import { type User } from "next-auth";
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

type EditableDataProps = {
  data?: Playlist | null;
  creatorData?: User | null;
  children: ReactNode;
};

function EditableDataComp({ data, creatorData, children }: EditableDataProps) {
  const isLoading = !data;
  const { data: tracksData, status } = useTracks();

  const tracksTime = useMemo(() => {
    const seconds = tracksData?.tracks
      ?.map((track) => track.duration)
      .reduce((a, b) => a + b, 0);
    return getTime(seconds ?? 0);
  }, [tracksData?.tracks]);

  const isDoneLoading =
    !isLoading && !!data && !!creatorData && status !== "loading";

  const { value: miniMenuValue } = useMiniMenu();

  return (
    <div>
      <div
        className={cn("flex gap-8 p-8 pb-6", miniMenuValue ? "flex-col" : "")}
      >
        <div className="flex w-[95%] flex-col">
          <h1
            title={data?.title}
            className="mb-5 line-clamp-1 w-[59rem] overflow-visible text-start text-6xl font-bold"
          >
            {isDoneLoading ? (
              data?.title
            ) : (
              <Skeleton className="mb-4 h-24 w-96" />
            )}
          </h1>
          <div className="flex gap-1.5">
            {isDoneLoading ? (
              <span className="flex items-center gap-1.5">
                <Navigate
                  data={{
                    href: `/artist/${creatorData?.id}?playlist=${data?.id}`,
                    title: creatorData?.name ?? "unknown",
                    type: "ARTIST",
                  }}
                  href={`/artist/${creatorData?.id}?playlist=${data?.id}`}
                >
                  {creatorData?.name}
                </Navigate>
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
            "flex w-full gap-4",
            !miniMenuValue ? "flex-col" : "flex-row border-t pt-4",
          )}
        >
          <div
            className={cn(
              "group relative",
              !miniMenuValue ? "size-[500px]" : "size-[300px]",
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
              !miniMenuValue ? "mb-auto flex-col-reverse" : "flex-col",
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
