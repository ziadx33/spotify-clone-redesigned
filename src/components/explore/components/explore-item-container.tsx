import { useSkipFirstEffect } from "@/hooks/use-skip-first-render";
import { cn } from "@/lib/utils";
import { type TrackSliceType } from "@/state/slices/tracks";
import { type ReactNode, useMemo, useRef, useState } from "react";

type ExploreItemContainerProps = {
  children: ReactNode;
  currentItemData?: TrackSliceType;
};

export function ExploreItemContainer({
  children,
  currentItemData,
}: ExploreItemContainerProps) {
  const currentTrackIdRenderRef = useRef(0);
  const [effect, setEffect] = useState<string>("");

  useSkipFirstEffect(() => {
    if (!currentItemData?.track?.id) return;
    if (currentTrackIdRenderRef.current === 0) {
      currentTrackIdRenderRef.current += 1;
      return;
    }
    setEffect("animate-full-bounce");
    setTimeout(() => {
      setEffect("");
    }, 300);
  }, [currentItemData?.track?.id]);
  const content = useMemo(() => {
    return children;
  }, [children]);
  return (
    <div
      className={cn(
        "border-lg flex h-[35rem] w-80 flex-col items-center rounded-xl  border-[1.5px] bg-card",
        effect,
      )}
    >
      {content}
    </div>
  );
}
