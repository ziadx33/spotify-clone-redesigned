/* eslint-disable react-hooks/exhaustive-deps */
import {
  useState,
  useEffect,
  type RefObject,
  type Dispatch,
  type SetStateAction,
} from "react";

export function useBestTrackDurationAudioFile(
  file: File | null,
  canvasRef: RefObject<HTMLCanvasElement>,
  setIsDraggingStart: Dispatch<SetStateAction<boolean>>,
  setIsDraggingEnd: Dispatch<SetStateAction<boolean>>,
  startMarker: number,
  endMarker: number,
  setStartMarker: React.Dispatch<React.SetStateAction<number>>,
  setEndMarker: React.Dispatch<React.SetStateAction<number>>,
) {
  const [fileDuration, setFileDuration] = useState(0);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const MAX_SELECTION_DURATION = 15;

  const setCanvasResolution = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const deviceRatio = window.devicePixelRatio || 2;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * deviceRatio;
    canvas.height = height * deviceRatio;
    ctx.scale(deviceRatio, deviceRatio);
  };

  const drawWaveform = (buffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setCanvasResolution();

    const channelData = buffer.getChannelData(0);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const sampleRate = Math.floor(channelData.length / canvasWidth);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#ddd";

    for (let i = 0; i < canvasWidth; i++) {
      const sample = channelData[i * sampleRate];
      const barHeight = ((sample ?? 0) * canvasHeight) / 2;

      ctx.fillRect(i, canvasHeight / 2 - barHeight, 1, barHeight * 2);
    }
  };

  useEffect(() => {
    setStartMarker(0);
    setEndMarker(0);
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
    setFileDuration(0);
    setAudioBuffer(null);
    setIsLoading(true);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (file) {
      const audioContext = new AudioContext();
      const reader = new FileReader();

      reader.onload = async () => {
        if (reader.result instanceof ArrayBuffer) {
          const buffer = await audioContext.decodeAudioData(reader.result);
          setAudioBuffer(buffer);
          setFileDuration(buffer.duration);

          const middle = buffer.duration / 2;
          setStartMarker(middle - MAX_SELECTION_DURATION / 2);
          setEndMarker(middle + MAX_SELECTION_DURATION / 2);

          drawWaveform(buffer);
          setIsLoading(false);
        }
      };

      reader.readAsArrayBuffer(file);

      return () => {
        void audioContext.close();
      };
    }
  }, [file]);

  useEffect(() => {
    setCanvasResolution();
  }, [file]);

  return {
    fileDuration,
    startMarker,
    setStartMarker,
    endMarker,
    setEndMarker,
    audioBuffer,
    isLoading,
  };
}
