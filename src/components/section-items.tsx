"use client";

import { type User, type Playlist } from "@prisma/client";
import { SectionItem } from "./components/section-item";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";

type SectionItemsProps = {
  playlists?: Playlist[];
  authors?: User[];
  title: string;
};

export function SectionItems({ playlists, authors, title }: SectionItemsProps) {
  const sectionItemWidth = 248.062;

  const TEST = [
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
    ...(playlists ?? []),
  ];

  const [nextClicked, setNextClicked] = useState(0);
  const [slicedCards, setSlicedCards] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      // Calculate the number of full cards that can fit in the viewport
      const fullCards = Math.floor(window.innerWidth / sectionItemWidth);
      setSlicedCards(fullCards);
    };

    handleResize(); // Set initial slicedCards based on current window size
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [sectionItemWidth]);

  const maxScrollIndex = Math.max(0, TEST.length - slicedCards);

  const showArrows = useMemo(() => {
    const itemsWidth = TEST.length * sectionItemWidth;
    return itemsWidth > window.innerWidth;
  }, [TEST.length, sectionItemWidth]);

  return (
    <div className="flex flex-col gap-3 p-6 pt-14">
      <div className="flex items-center justify-between">
        <h1 className="pt-8 text-3xl font-bold">{title}</h1>
        {showArrows && (
          <div className="flex gap-1">
            <Button
              onClick={() => {
                if (nextClicked > 0) {
                  setNextClicked((v) => v - 1);
                  containerRef.current?.scrollBy({
                    left: -sectionItemWidth,
                    behavior: "smooth",
                  });
                }
              }}
              size="icon"
              variant="outline"
              className="size-8 rounded-full"
            >
              <ArrowLeft size={12} />
            </Button>
            <Button
              onClick={() => {
                if (nextClicked < maxScrollIndex) {
                  setNextClicked((v) => v + 1);
                  containerRef.current?.scrollBy({
                    left: sectionItemWidth,
                    behavior: "smooth",
                  });
                }
              }}
              size="icon"
              variant="outline"
              className="size-8 rounded-full"
            >
              <ArrowRight size={12} />
            </Button>
          </div>
        )}
      </div>
      <div
        className="flex flex-row overflow-hidden"
        style={{
          width: sectionItemWidth * slicedCards,
        }}
        ref={containerRef}
      >
        {TEST.map((playlist, index) => (
          <SectionItem
            key={`${playlist.id}-${index}`}
            description={
              authors?.find((author) => playlist.creatorId === author.id)
                ?.name ?? ""
            }
            title={playlist.title}
            link={`/playlist/${playlist.id}`}
            image={playlist.imageSrc}
            showPlayButton
            type="PLAYLIST"
          />
        ))}
      </div>
    </div>
  );
}
