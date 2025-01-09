import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AvatarData } from "@/components/avatar-data";
import { SectionItem } from "@/components/components/section-item";
import { type Dispatch, type SetStateAction } from "react";
import { BestOfArtistsSectionDialogContent } from "./best-of-artists-section-dialog-content";
import { type User } from "@prisma/client";

type BestOfArtistsDialogProps = {
  setActiveDialog: Dispatch<SetStateAction<number | undefined | null>>;
  activeDialog?: number | null;
  index: number;
  datum: User;
  cardsColors: string[] | undefined;
};

export function BestOfArtistsDialog({
  setActiveDialog,
  index,
  datum,
  cardsColors,
  activeDialog,
}: BestOfArtistsDialogProps) {
  const color = cardsColors?.[index];
  return (
    <Dialog
      key={index}
      onOpenChange={(open) => setActiveDialog(open ? index : null)}
    >
      <DialogTrigger>
        <SectionItem
          disableContext
          artistData={datum}
          type="ARTIST"
          title={datum.name}
          customImage={
            <div className="size-full overflow-hidden rounded-sm">
              <AvatarData
                src={datum?.image ?? ""}
                containerClasses="size-full rounded-sm"
              />
              <div className="absolute bottom-5 flex items-center gap-2">
                <div style={{ backgroundColor: color }} className="h-5 w-1.5" />
                <h5 className="font-bold">This is {datum.name}</h5>
              </div>
              <div
                style={{ backgroundColor: color }}
                className="absolute bottom-0 z-10 h-2.5 w-full rounded-b-sm"
              />
            </div>
          }
          description={`This is ${datum.name}`}
        />
      </DialogTrigger>
      <BestOfArtistsSectionDialogContent
        artistId={datum.id}
        index={index}
        activeDialog={activeDialog}
      />
    </Dialog>
  );
}
