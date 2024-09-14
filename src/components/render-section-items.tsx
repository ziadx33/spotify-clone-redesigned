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
  buttons?: ReactNode[];
};

export function RenderSectionItems({
  cards,
  title,
  isLoading,
  titleClasses,
  cardsContainerClasses,
  containerClasses,
  fallbackComponent,
  buttons,
}: SectionItemsProps) {
  const [showMoreButton, setShowButton] = useState(false);
  if (!isLoading && cards?.length === 0) return fallbackComponent;
  return (
    <Dialog>
      <div className={cn("flex flex-col gap-3", containerClasses)}>
        <div className="flex items-end justify-between">
          <h1 className={cn("pt-8 text-3xl font-bold", titleClasses)}>
            {title}
          </h1>
          <div className="mr-2 flex h-fit items-center">
            {showMoreButton && (
              <DialogTrigger disabled={isLoading} asChild>
                <Button variant="outline">show more</Button>
              </DialogTrigger>
            )}
            {buttons}
          </div>
        </div>
        <div
          className={cn("flex flex-row overflow-hidden", cardsContainerClasses)}
        >
          {!isLoading && cards?.length !== 0 ? (
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
  );
}
