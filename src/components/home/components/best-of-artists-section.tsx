"use client";

import { RenderSectionItems } from "@/components/render-section-items";
import { getRandomValue } from "@/utils/get-random-value";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState, useMemo, useRef } from "react";
import { EditSectionButton } from "./edit-section-button";
import { useUserData } from "@/hooks/use-user-data";
import { getUserFollowing } from "@/server/actions/user";
import { BestOfArtistsDialog } from "./best-of-artists-dialog";

type BestOfArtistsSectionProps = {
  userId: string;
};

export function BestOfArtistsSection({ userId }: BestOfArtistsSectionProps) {
  const user = useUserData();

  const { data, isLoading } = useQuery({
    queryKey: [`best-of-artists-section`],
    queryFn: async () => {
      const artists = await getUserFollowing(user?.id ?? "");
      return artists;
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

  const [activeDialog, setActiveDialog] = useState<number | null | undefined>(
    null,
  );

  const cardsColors = useMemo(() => {
    return data?.map(() => getRandomMixColor());
  }, [data, getRandomMixColor]);

  const cards = useMemo(() => {
    return data?.map((datum, index) => {
      return (
        <BestOfArtistsDialog
          key={index}
          cardsColors={cardsColors}
          datum={datum}
          index={index}
          setActiveDialog={setActiveDialog}
          activeDialog={activeDialog}
        />
      );
    });
  }, [activeDialog, data, cardsColors]);

  return (
    <RenderSectionItems
      buttons={[
        <EditSectionButton
          key="edit-button"
          userId={userId}
          sectionId="best of artists"
        />,
      ]}
      cards={cards}
      id="best-of-artists"
      title="Best of artists"
      cardsContainerClasses="gap-2"
      isLoading={isLoading || !cards}
    />
  );
}
