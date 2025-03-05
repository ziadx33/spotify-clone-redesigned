import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MadeForYouSectionDialogContent } from "./made-for-you-section-dialog-content";
import { enumParser } from "@/utils/enum-parser";
import { AvatarData } from "@/components/avatar-data";
import { SectionItem } from "@/components/components/section-item";
import { type Dispatch, type SetStateAction } from "react";
import { type getHomeMadeForYouSectionData } from "@/server/queries/sections";

type MadeForYouDialogProps = {
  setActiveDialog: Dispatch<SetStateAction<number | undefined>>;
  activeDialog: number | undefined;
  index: number;
  datum: Awaited<ReturnType<typeof getHomeMadeForYouSectionData>>[number];
  cardsColors: string[] | undefined;
};

export function MadeForYouDialog({
  setActiveDialog,
  index,
  datum,
  cardsColors,
  activeDialog,
}: MadeForYouDialogProps) {
  const color = cardsColors?.[index];
  const title = `Daily Mix ${index + 1}`;
  return (
    <Dialog onOpenChange={(e) => setActiveDialog(e ? index : undefined)}>
      <DialogTrigger>
        <SectionItem
          disableContext
          type="PLAYLIST"
          title={title}
          customImage={
            <div className="size-full overflow-hidden rounded-sm">
              <AvatarData
                src={datum.authors[0]?.image ?? ""}
                containerClasses="size-full rounded-sm"
              />
              <div className="absolute bottom-5 flex items-center gap-2">
                <div style={{ backgroundColor: color }} className="h-5 w-1.5" />
                <h5 className="font-bold">{title}</h5>
              </div>
              <div
                style={{
                  backgroundColor: color,
                }}
                className="absolute bottom-0 z-10 h-2.5 w-full rounded-b-sm"
              />
            </div>
          }
          description={`${enumParser(datum.genre)} mix`}
        />
      </DialogTrigger>
      <MadeForYouSectionDialogContent
        activeDialog={activeDialog}
        genre={datum.genre}
        index={index}
      />
    </Dialog>
  );
}
