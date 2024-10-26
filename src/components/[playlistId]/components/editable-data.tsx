"use client";

import { Dialog, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { type Track, type Playlist, type User } from "@prisma/client";
import Image from "next/image";
import { memo, useRef, useMemo } from "react";
import { FaPen } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import { getTime } from "@/utils/get-time";
import { useSession } from "@/hooks/use-session";
import { Skeleton } from "@/components/ui/skeleton";
import { clampText } from "@/utils/clamp-text";
import { AvatarData } from "@/components/avatar-data";
import { EditPlaylistDialogContent } from "./edit-playlist-dialog-content";
import { PlaylistContext } from "@/components/contexts/playlist-context";
import { AuthorContext } from "@/components/contexts/author-context";

type EditableDataProps = {
  data?: Playlist | null;
  type: string;
  creatorData?: User | null;
  tracks?: Track[];
};

function EditableDataComp({
  data,
  type,
  creatorData,
  tracks,
}: EditableDataProps) {
  const { data: user } = useSession();
  const isEditable = user?.user?.id === data?.creatorId;
  const isLoading = !data;

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const editImageOverlay = (
    <div className="absolute left-0 top-0 hidden size-full flex-col items-center justify-center gap-4 bg-black bg-opacity-30 group-hover:flex">
      <FaPen size={50} />
      <p className="text-lg">choose photo</p>
    </div>
  );

  const tracksTime = useMemo(() => {
    const seconds = tracks
      ?.map((track) => track.duration)
      .reduce((a, b) => a + b, 0);
    return getTime(seconds ?? 0);
  }, [tracks]);

  return (
    <Dialog>
      <div className="flex h-[24rem] w-full gap-8 p-8 pb-6">
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
          {isEditable && editImageOverlay}
        </DialogTrigger>
        <div className="flex flex-col pt-[6.2rem]">
          {!isLoading ? (
            <h3 className="mb-2 mt-auto">{type}</h3>
          ) : (
            <Skeleton className="mb-2 h-2.5 w-16" />
          )}

          <PlaylistContext playlist={data}>
            <DialogTrigger
              disabled={!isEditable || isLoading}
              title={data?.title}
              className="mb-4 line-clamp-1 w-full overflow-visible text-start text-8xl font-bold"
            >
              {!isLoading ? (
                clampText(data.title, 23)
              ) : (
                <Skeleton className="mb-4 h-24 w-96" />
              )}
            </DialogTrigger>
          </PlaylistContext>
          {data?.description &&
            (!isLoading ? (
              <p className="mb-2 text-sm text-muted-foreground">
                {data?.description}
              </p>
            ) : (
              <Skeleton className="mb-4 h-2.5 w-24" />
            ))}
          <div className="flex gap-1.5">
            {creatorData?.image &&
              (!isLoading ? (
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
              ))}
            {!isLoading ? (
              <span className="flex items-center gap-1.5">
                <AuthorContext
                  asChild={false}
                  artist={creatorData}
                  playlistId={data.id}
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
        </div>
      </div>
      <EditPlaylistDialogContent data={data} closeButtonRef={closeButtonRef} />
      <DialogClose ref={closeButtonRef} />
    </Dialog>
  );
}

export const EditableData = memo(EditableDataComp);
