"use client";

import { useWindow } from "@/hooks/use-window";
import {
  useState,
  useEffect,
  type ReactElement,
  type Dispatch,
  type SetStateAction,
} from "react";

type RenderCardsProps<
  T extends ReactElement | undefined = ReactElement | undefined,
> = {
  cards: T[];
  setShowMoreButton?: Dispatch<SetStateAction<boolean>>;
};

export function RenderCards<
  T extends ReactElement | undefined = ReactElement | undefined,
>({ cards, setShowMoreButton }: RenderCardsProps<T>) {
  const cardWidth = 240;
  const cardsWidth = cardWidth * cards.length;
  const { width: windowWidth } = useWindow();
  const [showedCards, setShowedCards] = useState<T[] | null>(null);
  useEffect(() => {
    if (!windowWidth) return;
    const containerWidth = windowWidth - (windowWidth * 0.2 + 110);

    if (cardsWidth > containerWidth) {
      const length = Math.floor(containerWidth / cardWidth);
      setShowedCards(cards.slice(0, length === 0 ? 1 : length));
      setShowMoreButton?.(true);
    } else {
      setShowedCards(cards);
      setShowMoreButton?.(false);
    }
  }, [windowWidth, cards, cardsWidth, cardWidth, setShowMoreButton]);
  return showedCards ?? cards;
}
