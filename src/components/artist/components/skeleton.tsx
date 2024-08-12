import { Track } from "@/components/components/track";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, Table } from "@/components/ui/table";
import { ComponentPropsWithoutRef } from "react";

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

export function SectionItemSkeleton({ amount }: { amount: number }) {
  return Array.from({ length: amount })?.map((_, index) => (
    <Card
      key={index}
      className="group mx-2 border-none p-0 transition-colors hover:bg-card"
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
