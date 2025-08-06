"use client";

import { RenderCards } from "@/components/components/render-cards";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  id?: string;
};

export function RenderSectionItems({
  cards,
  title,
  isLoading,
  titleClasses,
  cardsContainerClasses,
  containerClasses,
  fallbackComponent,
  id,
  buttons,
}: SectionItemsProps) {
  const [showMoreButton, setShowButton] = useState(false);
  if (!isLoading && cards?.length === 0) return fallbackComponent;
  return (
    <Dialog>
      <div className={cn("flex flex-col gap-3", containerClasses)} id={id}>
        <div className="flex w-full items-end justify-between">
          <h1 className={cn("pt-8 text-3xl font-bold", titleClasses)}>
            {title}
          </h1>
          <div className="mr-2 flex h-fit items-center gap-2">
            {showMoreButton && (
              <DialogTrigger disabled={isLoading} asChild>
                <Button variant="outline">show more</Button>
              </DialogTrigger>
            )}
            {buttons}
          </div>
        </div>
        <div
          className={cn(
            "flex w-full flex-row gap-2 overflow-hidden",
            cardsContainerClasses,
          )}
        >
          {!isLoading && cards?.length !== 0 ? (
            <RenderCards
              cards={cards ?? []}
              setShowMoreButton={setShowButton}
            />
          ) : (
            <SectionItemSkeleton amount={3} />
          )}
        </div>
      </div>
      <DialogContent className="flex h-[70%] w-full max-w-[70rem] flex-wrap items-start overflow-y-scroll">
        <DialogTitle />
        {cards}
      </DialogContent>
    </Dialog>
  );
}
