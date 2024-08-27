"use client";

import { AvatarData } from "@/components/avatar-data";
import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useSession } from "@/hooks/use-session";
import { getHomeMadeForYouSection } from "@/server/actions/track";
import { enumParser } from "@/utils/enum-parser";
import { getRandomValue } from "@/utils/get-random-value";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { PlaylistDialog } from "./playlist-dialog";

export function MadeForYouSection() {
  const { data: user } = useSession();
  const { data } = useQuery({
    queryKey: [`home-made-for-you-section`],
    queryFn: async () => {
      const data = getHomeMadeForYouSection(user?.user?.tracksHistory ?? []);
      return data;
    },
    enabled: !!user?.user?.tracksHistory,
  });
  const colors = [
    "#8BD7CB",
    "#E4BABE",
    "#B0D8B4",
    "#DD6990",
    "#F3C168",
    "#007bff",
  ];
  const usedColors: string[] = [];
  const getRandomMixColor = useCallback(() => {
    const randomColor = getRandomValue(
      colors.filter((color) => !usedColors?.includes(color)),
    );
    usedColors.push(randomColor);
    return randomColor;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, usedColors, getRandomValue]);
  const [activeDialog, setActiveDialog] = useState(0);
  const cardsColors = useMemo(() => {
    const colors = data?.map(() => getRandomMixColor());
    return colors;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, getRandomMixColor]);
  const cards = useMemo(() => {
    return (
      data?.map((datum, index) => {
        const color = cardsColors?.[index];
        const title = `Daily Mix ${index + 1}`;
        return (
          <Dialog key={index} onOpenChange={() => setActiveDialog(index)}>
            <DialogTrigger>
              <SectionItem
                type="PLAYLIST"
                title={title}
                showPlayButton
                customImage={
                  <div className="size-full overflow-hidden  rounded-sm">
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
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                description={`${enumParser(datum.genre)} mix`}
              />
            </DialogTrigger>
            <PlaylistDialog {...datum} isActive={activeDialog === index} />
          </Dialog>
        );
      }) ?? []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDialog, data, getRandomMixColor]);
  return (
    <RenderSectionItems
      cards={cards}
      title="Made for you"
      cardsContainerClasses="gap-2"
      isLoading={!data}
    />
  );
}
