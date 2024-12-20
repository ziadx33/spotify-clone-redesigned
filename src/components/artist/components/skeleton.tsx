import { Track } from "@/components/components/track";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, Table } from "@/components/ui/table";
import { type ComponentPropsWithoutRef } from "react";
import { FaPlay } from "react-icons/fa";

type Skeleton<T extends object> = {
  amount: number;
} & T;

type TracksListSkeletonProps = Skeleton<{ title?: string }>;

export function TracksListSkeleton({ amount, title }: TracksListSkeletonProps) {
  return (
    <div className="w-full flex-col">
      {title && <h1 className="mb-4 text-3xl font-semibold">{title}</h1>}
      <Table>
        <TableBody>
          {Array.from({ length: amount })?.map((_, trackIndex) => (
            <Track isAlbum viewAs={"LIST"} key={trackIndex} skeleton />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function SectionItemSkeleton({
  amount,
  returnCards,
}: {
  amount: number;
  returnCards?: boolean;
}) {
  const cards = Array.from({ length: amount })?.map((_, index) => (
    <Card
      key={index}
      className="group border-none p-0 transition-colors hover:bg-card"
    >
      <CardContent className="p-0">
        <div className="flex h-[295.078px] w-[236.062px] flex-col p-[12px] text-start">
          <Skeleton className="mb-2 size-[212.062px]" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      </CardContent>
    </Card>
  ));

  return !returnCards ? <div className="flex gap-2">{cards}</div> : cards;
}

export function LibraryItemSkeleton({ amount }: { amount: number }) {
  return Array.from({ length: amount })?.map((_, index) => (
    <div key={index} className="flex h-[4.3rem] justify-start gap-3 px-2 ">
      <Skeleton className="h-[55px] w-[70px]" />
      <h4 className="flex w-full flex-col items-start gap-1">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="h-2.5 w-14" />
      </h4>
    </div>
  ));
}

export function TabSkeleton({ amount }: { amount: number }) {
  return Array.from({ length: amount })?.map((_, index) => (
    <div key={index} className="relative  flex w-64 p-0">
      <div className="flex size-full">
        <div className="mr-auto flex h-full w-[85%] items-center justify-start gap-2 pl-3">
          <Skeleton className="size-7" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
    </div>
  ));
}

export function SkeletonList({
  amount,
  ...restProps
}: { amount: number } & Partial<ComponentPropsWithoutRef<"div">>) {
  return Array.from({ length: amount })?.map((_, index) => (
    <Skeleton key={index} {...restProps} />
  ));
}

export function SkeletonAuthorList({ amount }: { amount: number }) {
  return Array.from({ length: amount }).map((_, i) => {
    return (
      <div key={i} className="flex h-fit w-full items-center gap-5 font-medium">
        <Skeleton className="size-[50px] rounded-full" />
        <Skeleton className="h-3 w-36" />
      </div>
    );
  });
}

export function SkeletonPlaylists({
  amount,
  ...restProps
}: { amount: number } & Partial<ComponentPropsWithoutRef<"div">>) {
  return Array.from({ length: amount })?.map((_, index) => (
    <div
      key={index}
      className="group relative flex h-12 w-full min-w-[300px] max-w-[600px] gap-2 overflow-hidden rounded-sm bg-secondary/70 transition-colors hover:bg-secondary/80"
      {...restProps}
    >
      <div className="relative h-full w-14">
        <Skeleton className="size-full" />
      </div>
      <div className="flex h-full w-full items-center justify-between pr-2">
        <Skeleton className="h-2.5 w-14" />
        <Button
          disabled
          size="icon"
          className="size-8 rounded-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
        >
          <FaPlay size={12} />
        </Button>
      </div>
    </div>
  ));
}
