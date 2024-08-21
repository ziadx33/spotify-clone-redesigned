"use client";

import { RenderCards } from "@/components/components/render-cards";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState, type ReactElement } from "react";

type SectionItemsProps = {
  cards: (ReactElement | undefined)[] | undefined;
  title: string;
};

export function RenderSectionItems({ cards, title }: SectionItemsProps) {
  const [showMoreButton, setShowButton] = useState(false);
  return cards?.length !== 0 ? (
    <Dialog>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="pt-8 text-3xl font-bold">{title}</h1>
          {showMoreButton && (
            <DialogTrigger asChild>
              <Button variant="outline">show more</Button>
            </DialogTrigger>
          )}
        </div>
        <div className="flex flex-row overflow-hidden">
          <RenderCards cards={cards ?? []} setShowMoreButton={setShowButton} />
        </div>
      </div>
      <DialogContent className="flex h-[70%] w-full max-w-[70rem] flex-wrap overflow-y-scroll">
        {cards}
      </DialogContent>
    </Dialog>
  ) : null;
}
