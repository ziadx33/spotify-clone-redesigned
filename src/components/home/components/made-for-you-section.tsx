"use client";

import { RenderSectionItems } from "@/components/render-section-items";
import { getRandomValue } from "@/utils/get-random-value";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState, useRef } from "react";
import { useUserData } from "@/hooks/use-user-data";
import { MadeForYouDialog } from "./made-for-you-dialog";
import { getHomeMadeForYouSectionData } from "@/server/queries/sections";

type MadeForYouSectionProps = {
  userId: string;
};

export function MadeForYouSection({ userId }: MadeForYouSectionProps) {
  const { tracksHistory } = useUserData();
  const { data } = useQuery({
    queryKey: [`home-made-for-you-section-${userId}`, tracksHistory],
    queryFn: async () => {
      const data = await getHomeMadeForYouSectionData({
        historyTracksIds: tracksHistory ?? [],
      });
      return data;
    },
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
        return (
          <MadeForYouDialog
            activeDialog={activeDialog}
            setActiveDialog={setActiveDialog}
            cardsColors={cardsColors}
            datum={datum}
            index={index}
            key={index}
          />
        );
      }) ?? []
    );
  }, [activeDialog, data, cardsColors]);

  return (
    <RenderSectionItems
      id="made-for-you"
      // buttons={[
      //   <EditSectionButton
      //     sectionId="made for you"
      //     key="edit-button"
      //     userId={userId}
      //   />,
      // ]}
      cards={cards}
      title="Made for you"
      cardsContainerClasses="gap-2"
      isLoading={!data}
    />
  );
}
