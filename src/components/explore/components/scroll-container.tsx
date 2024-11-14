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
    const event = (event: WheelEvent) => {
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

    const containerElement = containerRef.current;
    containerElement?.addEventListener("wheel", event);

    return () => {
      containerElement?.removeEventListener("wheel", event);
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
