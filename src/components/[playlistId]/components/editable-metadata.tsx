"use client";

import { AuthorContext } from "@/components/contexts/author-context";
import { type Playlist, type User, type Track } from "@prisma/client";
import Image from "next/image";
import { FaCircle } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";

export type EditableMetadataProps = {
  creatorData?: User | null;
  data?: Playlist | null;
  tracks?: Track[];
  tracksTime: string;
  isLoading: boolean;
};

function EditableMetadata({
  creatorData,
  data,
  tracks,
  tracksTime,
  isLoading,
}: EditableMetadataProps) {
  return (
    <div className="flex gap-1.5">
      {creatorData?.image && !isLoading ? (
        <Image
          width={25}
          height={25}
          draggable="false"
          alt={creatorData?.name ?? ""}
          src={creatorData?.image ?? ""}
          className="size-[25px] rounded-full"
        />
      ) : (
        <Skeleton className="size-[25px] rounded-full" />
      )}
      {!isLoading ? (
        <span className="flex items-center gap-1.5">
          <AuthorContext
            asChild={false}
            artist={creatorData}
            playlistId={data!.id}
          >
            {creatorData?.name}
          </AuthorContext>
          {(tracks?.length ?? 0) > 0 && (
            <>
              <FaCircle size="5" /> {tracks?.length} tracks{" "}
              <FaCircle size="5" /> {tracksTime}
            </>
          )}
        </span>
      ) : (
        <Skeleton className="my-auto h-2.5 w-36" />
      )}
    </div>
  );
}

export default EditableMetadata;
