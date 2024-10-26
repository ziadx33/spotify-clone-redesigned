import { DialogContent } from "@/components/ui/dialog";
import { EditForm } from "./edit-form";
import { type Playlist } from "@prisma/client";
import {
  type Dispatch,
  type SetStateAction,
  type MutableRefObject,
} from "react";
import { FaPen } from "react-icons/fa";

type EditDialogContentProps = {
  data?: Playlist | null;
  closeButtonRef?: MutableRefObject<HTMLButtonElement | null>;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

export function EditPlaylistDialogContent({
  data,
  closeButtonRef,
  setOpen,
}: EditDialogContentProps) {
  const overlay = (
    <div className="absolute left-0 top-0 hidden size-full flex-col items-center justify-center gap-4 bg-black bg-opacity-30 group-hover:flex">
      <FaPen size={50} />
      <p className="text-lg">choose photo</p>
    </div>
  );
  return (
    <DialogContent className="flex h-fit w-[68rem]  flex-col items-start">
      <EditForm
        setOpen={setOpen}
        closeDialogRef={closeButtonRef}
        data={data}
        editImageOverlay={overlay}
      />
    </DialogContent>
  );
}
