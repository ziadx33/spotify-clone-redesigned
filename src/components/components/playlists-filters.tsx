"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants";
import { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useIntersectionObserver } from "usehooks-ts";
import { Playlists } from "./playlists";

export function PlaylistFilters() {
  const intersectionData = {
    threshold: 0.5,
  };
  const { isIntersecting: isFirstBadgeIntersecting, ref: firstBadgeRef } =
    useIntersectionObserver(intersectionData);
  const { isIntersecting: isLastBadgeIntersecting, ref: lastBadgeRef } =
    useIntersectionObserver(intersectionData);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (type: "RIGHT" | "LEFT") => {
    containerRef.current?.scrollBy({
      left: -(type === "RIGHT" ? -100 : 100),
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="relative mb-4 h-6">
        <div
          ref={containerRef}
          className="flex h-full w-full items-center gap-2 overflow-y-auto overflow-x-scroll [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((category, categoryIndex) => (
            <Badge className="cursor-pointer text-nowrap" key={categoryIndex}>
              <span ref={categoryIndex === 0 ? firstBadgeRef : lastBadgeRef}>
                {category}
              </span>
            </Badge>
          ))}
        </div>
        {!isLastBadgeIntersecting && (
          <Button
            onClick={() => scrollContainer("RIGHT")}
            size="icon"
            variant="outline"
            className="absolute -right-1 top-1/2 z-10 -translate-y-1/2 rounded-full p-0.5 shadow-2xl"
          >
            <FaArrowRight />
          </Button>
        )}
        {!isFirstBadgeIntersecting && (
          <Button
            onClick={() => scrollContainer("LEFT")}
            size="icon"
            variant="outline"
            className="absolute -left-1 top-1/2 z-10 -translate-y-1/2 rounded-full p-0.5 shadow-2xl"
          >
            <FaArrowLeft />
          </Button>
        )}
      </div>
      <div className="flex flex-col">
        <Playlists />
      </div>
    </>
  );
}
