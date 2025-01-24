/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import Loading from "@/components/ui/loading";
import { Marker } from "./marker";
import { useMarkerDrag } from "@/hooks/use-mark-drag";
import { useBestTrackDurationAudioFile } from "@/hooks/use-best-track-duration-audio-file";
import { BestOfTrackPlaySection } from "./best-of-track-play-section";

type BestOfTrackProps = {
  file: File;
  startMarker: number;
  endMarker: number;
  setStartMarker: React.Dispatch<React.SetStateAction<number>>;
  setEndMarker: React.Dispatch<React.SetStateAction<number>>;
};

export function BestOfTrack({
  file,
  endMarker,
  setEndMarker,
  setStartMarker,
  startMarker,
}: BestOfTrackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);

  const { fileDuration, isLoading } = useBestTrackDurationAudioFile(
    file,
    canvasRef,
    setIsDraggingStart,
    setIsDraggingEnd,
    startMarker,
    endMarker,
    setStartMarker,
    setEndMarker,
  );
  const {} = useMarkerDrag(
    fileDuration,
    startMarker,
    endMarker,
    setStartMarker,
    setEndMarker,
    canvasRef,
    isDraggingStart,
    isDraggingEnd,
    setIsDraggingStart,
    setIsDraggingEnd,
  );

  return (
    <div className="relative mt-4">
      <div className="relative h-36 w-full overflow-hidden rounded-lg border-2">
        <canvas ref={canvasRef} className="size-full" />
        {isLoading && (
          <div className="absolute left-0 top-0 z-50 size-full bg-card">
            <Loading width="50" className="absolute left-0 top-0 size-full" />
          </div>
        )}

        <Marker
          position={startMarker}
          onMouseDown={() => setIsDraggingStart(true)}
          isStart={true}
          fileDuration={fileDuration}
        />
        <Marker
          position={endMarker}
          onMouseDown={() => setIsDraggingEnd(true)}
          isStart={false}
          fileDuration={fileDuration}
        />

        <div
          className="absolute top-0 z-10 h-full bg-destructive opacity-50"
          style={{
            left: `${(startMarker / fileDuration) * 100}%`,
            width: `${((endMarker - startMarker) / fileDuration) * 100}%`,
          }}
        ></div>
      </div>
      <BestOfTrackPlaySection
        endMarker={endMarker}
        startMarker={startMarker}
        file={file}
        fileDuration={fileDuration}
      />
    </div>
  );
}
