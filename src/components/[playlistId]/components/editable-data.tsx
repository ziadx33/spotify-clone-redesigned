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
import Link from "next/link";

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
            disabled={!isEditable}
            className="group relative h-[288px] w-[288px]"
          >
            <Image
              src={data?.imageSrc ?? ""}
              fill
              draggable="false"
              alt={data?.title ?? ""}
              className="rounded-md object-cover"
            />
            {isEditable && editImageOverlay}
          </DialogTrigger>
          <div className="flex flex-col pt-[6.2rem]">
            <h3 className="mb-4">{type}</h3>
            <DialogTrigger
              disabled={!isEditable}
              title={data?.title}
              className="mb-5 line-clamp-1 w-[59rem] text-start text-8xl font-bold"
            >
              {data?.title}
            </DialogTrigger>
            <p className="mb-0.5 text-sm text-muted-foreground">
              {data?.description}
            </p>
            <div className="flex gap-1.5">
              {creatorData?.image && (
                <Image
                  width={25}
                  height={25}
                  draggable="false"
                  alt={creatorData?.name ?? ""}
                  src={creatorData?.image ?? ""}
                  className="size-[25px] rounded-full"
                />
              )}
              <span className="flex items-center gap-1.5">
                <Link href={`/artist/${creatorData?.id}?playlist=${data?.id}`}>
                  {creatorData?.name}
                </Link>
                {(tracks?.length ?? 0) > 0 && (
                  <>
                    <FaCircle size="5" /> {tracks?.length} tracks{" "}
                    <FaCircle size="5" /> {tracksTime}
                  </>
                )}
              </span>
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
