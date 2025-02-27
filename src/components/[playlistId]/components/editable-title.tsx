"use client";

import { DialogTrigger } from "@/components/ui/dialog";
import { PlaylistContext } from "@/components/contexts/playlist-context";
import { type Playlist } from "@prisma/client";
import { clampText } from "@/utils/clamp-text";
import { Skeleton } from "@/components/ui/skeleton";

export type EditableTitleProps = {
  data?: Playlist | null;
  type: string;
  isEditable: boolean;
  isLoading: boolean;
};

function EditableTitle({
  data,
  type,
  isEditable,
  isLoading,
}: EditableTitleProps) {
  return (
    <>
      {!isLoading ? (
        <h3 className="mb-2 mt-auto max-lg:hidden">{type}</h3>
      ) : (
        <Skeleton className="mb-2 h-2.5 w-16 max-lg:hidden" />
      )}
      <PlaylistContext playlist={data}>
        <DialogTrigger
          disabled={!isEditable || isLoading}
          title={data?.title}
          className="mb-4 line-clamp-1 w-full max-lg:mt-6 overflow-visible text-start max-lg:text-2xl text-8xl font-bold"
        >
          {!isLoading ? (
            clampText(data?.title ?? "", 23)
          ) : (
            <Skeleton className="mb-4 h-24 w-96" />
          )}
        </DialogTrigger>
      </PlaylistContext>
    </>
  );
}

export default EditableTitle;
