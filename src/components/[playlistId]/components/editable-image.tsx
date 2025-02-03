"use client";

import { DialogTrigger } from "@/components/ui/dialog";
import { type Playlist } from "@prisma/client";
import { FaPen } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarData } from "@/components/avatar-data";

export type EditableImageProps = {
  data?: Playlist | null;
  isEditable: boolean;
  isLoading: boolean;
};

function EditableImage({ data, isEditable, isLoading }: EditableImageProps) {
  return (
    <DialogTrigger
      disabled={!isEditable || isLoading}
      className="group relative h-full"
    >
      {!isLoading ? (
        <AvatarData
          src={data?.imageSrc ?? ""}
          draggable="false"
          alt={data?.title ?? ""}
          className="rounded-md"
          containerClasses="h-full w-fit rounded-none"
        />
      ) : (
        <Skeleton className="size-full" />
      )}
      {isEditable && (
        <div className="absolute left-0 top-0 hidden size-full flex-col items-center justify-center gap-4 bg-black bg-opacity-30 group-hover:flex">
          <FaPen size={50} />
          <p className="text-lg">choose photo</p>
        </div>
      )}
    </DialogTrigger>
  );
}

export default EditableImage;
