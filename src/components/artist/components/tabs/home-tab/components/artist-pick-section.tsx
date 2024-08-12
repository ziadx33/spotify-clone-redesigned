import { Skeleton } from "@/components/ui/skeleton";
import { type getTrackById } from "@/server/actions/track";
import Image from "next/image";
import Link from "next/link";
import { SkeletonList } from "../../../skeleton";

type ArtistPickSectionProps = {
  loading: boolean;
  data?: Awaited<ReturnType<typeof getTrackById>>;
  name?: string;
};

export function ArtistPickSection({
  loading,
  data,
  name,
}: ArtistPickSectionProps) {
  return (
    <div className="flex flex-col">
      <h1 className="mb-3 text-xl font-semibold">Artist Pick</h1>
      <div className="flex gap-2">
        {!loading ? (
          <>
            <Image
              src={data?.imgSrc ?? ""}
              width={80}
              height={80}
              alt={data?.title ?? ""}
              className="rounded-lg"
              draggable="false"
            />
            <Link
              href={`/playlist/${data?.albumId}`}
              className="h-fit font-medium hover:underline"
            >
              Listen to the best of <br /> {name}
            </Link>
          </>
        ) : (
          <>
            <Skeleton className="size-[80px]" />
            <div className="flex flex-col gap-1">
              <SkeletonList amount={2} className="h-2.5 w-24" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
