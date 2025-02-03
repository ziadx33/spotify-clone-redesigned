"use client";

import { type Playlist } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

export type EditableDescriptionProps = {
  data?: Playlist | null;
  isLoading: boolean;
};

function EditableDescription({ data, isLoading }: EditableDescriptionProps) {
  return (
    <>
      {data?.description &&
        (!isLoading ? (
          <p className="mb-2 text-sm text-muted-foreground">
            {data.description}
          </p>
        ) : (
          <Skeleton className="mb-4 h-2.5 w-24" />
        ))}
    </>
  );
}

export default EditableDescription;
