"use client";

import { AvatarData } from "@/components/avatar-data";
import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getHomeMadeForYouSection } from "@/server/actions/track";
import { enumParser } from "@/utils/enum-parser";
import { getRandomValue } from "@/utils/get-random-value";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState, useRef } from "react";
import { EditSectionButton } from "./edit-section-button";
import { useUserData } from "@/hooks/use-user-data";
import { MadeForYouSectionDialogContent } from "./made-for-you-section-dialog-content";

type MadeForYouSectionProps = {
  userId: string;
};

export function MadeForYouSection({ userId }: MadeForYouSectionProps) {
  const { tracksHistory } = useUserData();
  const { data } = useQuery({
    queryKey: [`home-made-for-you-sectionssss`],
    queryFn: async () => {
      const data = getHomeMadeForYouSection(tracksHistory ?? []);
      return data;
    },
    enabled: !!tracksHistory,
  });

  const colors = useRef([
    "#8BD7CB",
    "#E4BABE",
    "#B0D8B4",
    "#DD6990",
    "#F3C168",
    "#007bff",
  ]);
  const usedColors = useRef<string[]>([]);
  const getRandomMixColor = useCallback(() => {
    const availableColors = colors.current.filter(
      (color) => !usedColors.current.includes(color),
    );
    const randomColor = getRandomValue(availableColors);
    usedColors.current.push(randomColor);
    return randomColor;
  }, []);

  const [activeDialog, setActiveDialog] = useState<number | undefined>();

  const cardsColors = useMemo(() => {
    return data?.map(() => getRandomMixColor());
  }, [data, getRandomMixColor]);

  const cards = useMemo(() => {
    return (
      data?.map((datum, index) => {
        const color = cardsColors?.[index];
        const title = `Daily Mix ${index + 1}`;
        return (
          <Dialog
            key={index}
            onOpenChange={(e) => setActiveDialog(e ? index : undefined)}
          >
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
                      <div
                        style={{ backgroundColor: color }}
                        className="h-5 w-1.5"
                      />
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
      }) ?? []
    );
  }, [activeDialog, data, cardsColors]);

  return (
    <RenderSectionItems
      id="made-for-you"
      buttons={[
        <EditSectionButton
          sectionId="made for you"
          key="edit-button"
          userId={userId}
        />,
      ]}
      cards={cards}
      title="Made for you"
      cardsContainerClasses="gap-2"
      isLoading={!data}
    />
  );
}
