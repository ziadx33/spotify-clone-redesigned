"use client";

import { Dialog, DialogClose } from "@/components/ui/dialog";
import { type Playlist, type User, type Track } from "@prisma/client";
import { memo, useRef, useMemo } from "react";
import { getTime } from "@/utils/get-time";
import { useUserData } from "@/hooks/use-user-data";
import EditableImage from "./editable-image";
import EditableTitle from "./editable-title";
import EditableDescription from "./editable-description";
import EditableMetadata from "./editable-metadata";
import { EditPlaylistDialogContent } from "./edit-playlist-dialog-content";

export type EditableDataProps = {
  data?: Playlist | null;
  type: string;
  creatorData?: User | null;
  tracks?: Track[];
};

function EditableData({ data, type, creatorData, tracks }: EditableDataProps) {
  const user = useUserData();
  const isEditable = user?.id === data?.creatorId;
  const isLoading = !data;
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const tracksTime = useMemo(() => {
    const seconds = tracks
      ?.map((track) => track.duration)
      .reduce((a, b) => a + b, 0);
    return getTime(seconds ?? 0);
  }, [tracks]);

  return (
    <Dialog>
      <div className="flex h-[24rem] w-full gap-8 p-8 pb-6">
        <EditableImage
          data={data}
          isEditable={isEditable}
          isLoading={isLoading}
        />
        <div className="flex flex-col pt-[6.2rem]">
          <EditableTitle
            data={data}
            type={type}
            isEditable={isEditable}
            isLoading={isLoading}
          />
          <EditableDescription data={data} isLoading={isLoading} />
          <EditableMetadata
            creatorData={creatorData}
            data={data}
            tracks={tracks}
            tracksTime={tracksTime}
            isLoading={isLoading}
          />
        </div>
      </div>
      <EditPlaylistDialogContent data={data} closeButtonRef={closeButtonRef} />
      <DialogClose ref={closeButtonRef} />
    </Dialog>
  );
}

export default memo(EditableData);
