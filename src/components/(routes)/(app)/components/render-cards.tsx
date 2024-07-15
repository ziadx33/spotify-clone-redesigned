"use client";

import { useWindow } from "@/hooks/use-window";
import { useState, useEffect, type ReactElement } from "react";

type RenderCardsProps<T extends ReactElement = ReactElement> = {
  cards: T[];
};

export function RenderCards<T extends ReactElement = ReactElement>({
  cards,
}: RenderCardsProps<T>) {
  const cardWidth = 240;
  const cardsWidth = cardWidth * cards.length;
  const { width: windowWidth } = useWindow();
  const [showedCards, setShowedCards] = useState<T[] | null>(null);
  useEffect(() => {
    if (!windowWidth) return;
    const containerWidth = windowWidth - (windowWidth * 0.2 + 110);

    if (cardsWidth > containerWidth) {
      setShowedCards(cards.slice(0, Math.floor(containerWidth / cardWidth)));
      console.log("whatt");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth]);
  return showedCards ?? cards;
}
