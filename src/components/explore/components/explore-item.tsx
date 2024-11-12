import { AuthorContext } from "@/components/contexts/author-context";
import { TrackContext } from "@/components/contexts/track-context";
import { Badge } from "@/components/ui/badge";
import { type TrackSliceType } from "@/state/slices/tracks";
import { enumParser } from "@/utils/enum-parser";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ExploreItemContainer } from "./explore-item-container";
import { TrackProgress } from "./track-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { type ExploreSliceData } from "@/state/slices/explore";

type ExploreItemProps = {
  currentItemData?: TrackSliceType;
  isExploreFetchLoading: boolean;
  exploreData: ExploreSliceData["data"];
};

export function ExploreItem({
  currentItemData,
  isExploreFetchLoading,
  exploreData,
}: ExploreItemProps) {
  const genres = useMemo(() => {
    if (!currentItemData?.track?.genres) return [];
    return isExploreFetchLoading
      ? currentItemData.track.genres.map((genre) => (
          <Badge key={genre}>
            <Link href={`/search/genre?genre=${genre}`}>
              {enumParser(genre)}
            </Link>
          </Badge>
        ))
      : [];
  }, [currentItemData?.track?.genres, isExploreFetchLoading]);

  return (
    <ExploreItemContainer currentItemData={currentItemData}>
      <div className="relative mt-24 size-48 overflow-hidden rounded-lg border">
        {!isExploreFetchLoading ? (
          <Image
            alt={currentItemData?.track?.title ?? ""}
            src={currentItemData?.track?.imgSrc ?? ""}
            fill
          />
        ) : (
          <Skeleton className="size-full" />
        )}
      </div>
      <div className="mb-3 mt-auto flex w-full flex-col px-4">
        <div className="flex flex-col">
          <div className="mb-2.5 flex gap-2">{genres}</div>
          <div className="mb-2 flex h-16 gap-2">
            <div className="relative h-full w-16 overflow-hidden rounded-md">
              {!isExploreFetchLoading ? (
                <TrackContext
                  playlist={currentItemData?.album}
                  track={currentItemData?.track}
                >
                  <Link href={`/playlist/${currentItemData?.album?.id}`}>
                    <Image
                      fill
                      alt={currentItemData?.track?.title ?? ""}
                      src={currentItemData?.track?.imgSrc ?? ""}
                    />
                  </Link>
                </TrackContext>
              ) : (
                <Skeleton className="size-full" />
              )}
            </div>
            <div className="mt-2 flex flex-col">
              {!isExploreFetchLoading ? (
                <TrackContext
                  playlist={currentItemData?.album}
                  track={currentItemData?.track}
                >
                  <Link href={`/playlist/${currentItemData?.album?.id}`}>
                    <h3 className="font-semibold">
                      {currentItemData?.track?.title}
                    </h3>
                  </Link>
                </TrackContext>
              ) : (
                <Skeleton className="mb-2 h-6 w-36" />
              )}
              {!isExploreFetchLoading ? (
                <AuthorContext
                  artist={currentItemData?.author}
                  playlistId={currentItemData?.album?.id ?? "unknown"}
                >
                  <Link
                    href={`/artist/${currentItemData?.author?.id}?playlist=${currentItemData?.album?.id ?? "unknown"}`}
                  >
                    <p className="text-muted-foreground">
                      {currentItemData?.author?.name}
                    </p>
                  </Link>
                </AuthorContext>
              ) : (
                <Skeleton className="h-4 w-24" />
              )}
            </div>
          </div>
        </div>
        <TrackProgress
          exploreData={exploreData}
          isExploreFetchLoading={isExploreFetchLoading}
          currentItemData={currentItemData}
        />
      </div>
    </ExploreItemContainer>
  );
}
