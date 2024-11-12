import { Progress } from "@/components/ui/progress";
import { type ExploreSliceData } from "@/state/slices/explore";
import { type TrackSliceType } from "@/state/slices/tracks";
import { usePathname } from "next/navigation";
import { memo, useEffect, useRef, useState } from "react";

type TrackProgressProps = {
  currentItemData?: TrackSliceType;
  isExploreFetchLoading: boolean;
  exploreData: ExploreSliceData["data"];
};

function Comp({
  currentItemData,
  exploreData,
  isExploreFetchLoading,
}: TrackProgressProps) {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const currentTrackIdRef = useRef<string | null>(null);
  const [progress, setProgress] = useState(0);
  const startTime = currentItemData?.track?.bestTimeStart ?? 0;
  const endTime = currentItemData?.track?.bestTimeEnd ?? 15;
  const pathname = usePathname();

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
      });
      currentTrackIdRef.current = null;
    };
  }, [pathname]);

  useEffect(() => {
    if (isExploreFetchLoading || !exploreData?.tracks) return;
    const newAudioRefs = new Map(audioRefs.current);

    exploreData.tracks.forEach((track) => {
      if (!newAudioRefs.has(track.id)) {
        const audio = new Audio(track.trackSrc ?? "");
        newAudioRefs.set(track.id, audio);
      }
    });

    audioRefs.current = newAudioRefs;
  }, [exploreData, isExploreFetchLoading]);

  const stopAllAudios = () =>
    audioRefs.current.forEach((audio) => audio.pause());

  useEffect(() => {
    if (isExploreFetchLoading || !currentItemData?.track?.id) return;

    const trackId = currentItemData.track.id;

    if (currentTrackIdRef.current === trackId) return;
    currentTrackIdRef.current = trackId;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    stopAllAudios();

    debounceTimeoutRef.current = setTimeout(() => {
      const audio = audioRefs.current.get(trackId);
      if (audio) {
        audio.currentTime = startTime;

        const handleTimeUpdate = () => {
          if (endTime && audio.currentTime >= endTime) {
            audio.currentTime = startTime;
          }
          const totalDuration = endTime - startTime;
          if (totalDuration > 0) {
            setProgress(
              ((audio.currentTime - startTime) / totalDuration) * 100,
            );
          }
        };

        audio.addEventListener("canplay", () => {
          stopAllAudios();
          void audio.play();
        });
        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
          audio.removeEventListener("timeupdate", handleTimeUpdate);
        };
      }
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [currentItemData, startTime, endTime, isExploreFetchLoading]);

  return (
    <div>
      <Progress
        className="h-2 w-full overflow-hidden"
        value={progress}
        max={100}
      />
    </div>
  );
}

export const TrackProgress = memo(Comp);
