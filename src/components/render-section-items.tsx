"use client";

import { RenderCards } from "@/components/components/render-cards";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { type ReactNode, useState, type ReactElement } from "react";
import { SectionItemSkeleton } from "./artist/components/skeleton";
import { cn } from "@/lib/utils";

type SectionItemsProps = {
  cards: (ReactElement | undefined)[] | undefined;
  title: string;
  isLoading?: boolean;
  titleClasses?: string;
  containerClasses?: string;
  cardsContainerClasses?: string;
  fallbackComponent?: ReactNode;
};

export function RenderSectionItems({
  cards,
  title,
  isLoading,
  titleClasses,
  cardsContainerClasses,
  containerClasses,
  fallbackComponent,
}: SectionItemsProps) {
  const [showMoreButton, setShowButton] = useState(false);
  return cards?.length !== 0 ? (
    <Dialog>
      <div className={cn("flex flex-col gap-3", containerClasses)}>
        <div className="flex items-center justify-between">
          <h1 className={cn("pt-8 text-3xl font-bold", titleClasses)}>
            {title}
          </h1>
          {showMoreButton && (
            <DialogTrigger disabled={isLoading} asChild>
              <Button variant="outline">show more</Button>
            </DialogTrigger>
          )}
        </div>
        <div
          className={cn("flex flex-row overflow-hidden", cardsContainerClasses)}
        >
          {!isLoading ? (
            <RenderCards
              cards={cards ?? []}
              setShowMoreButton={setShowButton}
            />
          ) : (
            <SectionItemSkeleton amount={5} />
          )}
        </div>
      </div>
      <DialogContent className="flex h-[70%] w-full max-w-[70rem] flex-wrap items-start overflow-y-scroll">
        {cards}
      </DialogContent>
    </Dialog>
  ) : (
    fallbackComponent
  );
}
