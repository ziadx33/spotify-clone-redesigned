import { type ExploreSliceData } from "@/state/slices/explore";
import { type Track } from "@prisma/client";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useRef,
} from "react";

type ScrollContainerProps = {
  children: ReactNode;
  setCurrentItem: Dispatch<SetStateAction<Track | undefined>>;
  exploreData: ExploreSliceData["data"];
};

export function ScrollContainer({
  children,
  setCurrentItem,
  exploreData,
}: ScrollContainerProps) {
  const currentItemNumRef = useRef(0);
  const scrollLengthRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (!exploreData.tracks?.length) return;

      scrollLengthRef.current += event.deltaY > 0 ? -1 : 1;

      if (scrollLengthRef.current >= 5) {
        if (currentItemNumRef.current > 0) {
          currentItemNumRef.current -= 1;
          setCurrentItem(exploreData.tracks[currentItemNumRef.current]);
        }
        scrollLengthRef.current = 0;
      } else if (scrollLengthRef.current <= -5) {
        if (currentItemNumRef.current < exploreData.tracks.length - 1) {
          currentItemNumRef.current += 1;
          setCurrentItem(exploreData.tracks[currentItemNumRef.current]);
        }
        scrollLengthRef.current = 0;
      }

      event.preventDefault();
    };

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      startX = event?.touches?.[0]?.clientX ?? 0;
      startY = event?.touches?.[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      endX = event?.touches?.[0]?.clientX ?? 0;
      endY = event?.touches?.[0]?.clientY ?? 0;
    };

    const handleTouchEnd = () => {
      const deltaX = startX - endX;
      const deltaY = startY - endY;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        if (deltaY > 50) {
          if (
            currentItemNumRef.current <
            (exploreData?.tracks?.length ?? 0) - 1
          ) {
            currentItemNumRef.current += 1;
            setCurrentItem(exploreData.tracks?.[currentItemNumRef.current]);
          }
        } else if (deltaY < -50) {
          if (currentItemNumRef.current > 0) {
            currentItemNumRef.current -= 1;
            setCurrentItem(exploreData.tracks?.[currentItemNumRef.current]);
          }
        }
      }
    };

    const containerElement = containerRef.current;
    containerElement?.addEventListener("wheel", handleWheel);
    containerElement?.addEventListener("touchstart", handleTouchStart);
    containerElement?.addEventListener("touchmove", handleTouchMove);
    containerElement?.addEventListener("touchend", handleTouchEnd);

    return () => {
      containerElement?.removeEventListener("wheel", handleWheel);
      containerElement?.removeEventListener("touchstart", handleTouchStart);
      containerElement?.removeEventListener("touchmove", handleTouchMove);
      containerElement?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [exploreData.tracks, setCurrentItem]);

  return (
    <div
      ref={containerRef}
      className="absolute m-auto grid size-full place-items-center"
    >
      {children}
    </div>
  );
}
