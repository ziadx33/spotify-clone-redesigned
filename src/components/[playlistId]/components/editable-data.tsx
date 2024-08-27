"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {} from "@/components/ui/form";
import { type Track, type Playlist, type User } from "@prisma/client";
import Image from "next/image";
import { memo, useRef, useMemo } from "react";
import { FaPen } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import { getTime } from "@/utils/get-time";
import { useSession } from "@/hooks/use-session";
import { EditForm } from "./edit-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navigate } from "@/components/navigate";
import { Skeleton } from "@/components/ui/skeleton";

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
  const closeDialog = closeButtonRef.current?.click;

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
    <div className="h-fit w-full border-b">
      <Dialog>
        <div className="flex h-fit w-full gap-8 p-8 pb-6">
          <DialogTrigger
            disabled={!isEditable || isLoading}
            className="group relative h-[288px] w-[288px]"
          >
            {!isLoading ? (
              <Image
                src={data?.imageSrc ?? ""}
                fill
                draggable="false"
                alt={data?.title ?? ""}
                className="rounded-md"
              />
            ) : (
              <Skeleton className="size-full" />
            )}
            {isEditable && editImageOverlay}
          </DialogTrigger>
          <div className="flex flex-col pt-[6.2rem]">
            {!isLoading ? (
              <h3 className="mb-4">{type}</h3>
            ) : (
              <Skeleton className="mb-4 h-2.5 w-16" />
            )}

            <DialogTrigger
              disabled={!isEditable || isLoading}
              title={data?.title}
              className="mb-5 line-clamp-1 w-[59rem] overflow-visible text-start text-8xl font-bold"
            >
              {!isLoading ? (
                data?.title
              ) : (
                <Skeleton className="mb-4 h-24 w-96" />
              )}
            </DialogTrigger>
            {data?.description &&
              (!isLoading ? (
                <p className="mb-1 text-sm text-muted-foreground">
                  {data?.description}
                </p>
              ) : (
                <Skeleton className="mb-4 h-2.5 w-24" />
              ))}
            <div className="mt-auto flex gap-1.5">
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
                  <Navigate
                    data={{
                      href: `/artist/${creatorData?.id}?playlist=${data?.id}`,
                      title: creatorData?.name ?? "unknown",
                      type: "ARTIST",
                    }}
                    href={`/artist/${creatorData?.id}?playlist=${data?.id}`}
                  >
                    {creatorData?.name}
                  </Navigate>
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
        <DialogContent
          className={cn(
            "flex flex-col items-start",
            isEditable ? "h-[26rem] w-[53rem]" : "size-fit p-10",
          )}
        >
          {isEditable ? (
            <EditForm
              closeDialog={closeDialog}
              data={data}
              editImageOverlay={editImageOverlay}
            />
          ) : (
            <>
              <Image
                src={data?.imageSrc ?? ""}
                width={600}
                height={600}
                alt={data?.description ?? ""}
              />
              <Button className="w-full" onClick={closeDialog}>
                close
              </Button>
            </>
          )}
        </DialogContent>
        <DialogClose ref={closeButtonRef} />
      </Dialog>
    </div>
  );
}

export const EditableData = memo(EditableDataComp);
