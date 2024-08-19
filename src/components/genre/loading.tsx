import { SectionItemSkeleton } from "../artist/components/skeleton";
import { Skeleton } from "../ui/skeleton";

export function Loading() {
  return (
    <div className="flex flex-col">
      <div className="flex h-72 items-end border-b pb-8 pl-4">
        <h1 className="text-8xl font-black"></h1>
        <Skeleton className="h-12 w-48" />
      </div>
      <div className="flex flex-col pb-3 pl-6">
        <div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h1 className="pt-8 text-3xl font-bold">New Releases</h1>
            </div>
            <div className="flex flex-row overflow-hidden">
              <SectionItemSkeleton amount={5} />
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h1 className="flex gap-2 pt-8 text-3xl font-bold">
                Popular <Skeleton className="h-10 w-24" /> playlists
              </h1>
            </div>
            <div className="flex flex-row overflow-hidden">
              <SectionItemSkeleton amount={5} />
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h1 className="flex gap-2 pt-8 text-3xl font-bold">
                Most Streamed <Skeleton className="h-10 w-24" />
                artists on spotify
              </h1>
            </div>
            <div className="flex flex-row overflow-hidden">
              <SectionItemSkeleton amount={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
