import { useState, useEffect, useRef } from "react";

export function useAudioControl(startMarker: number, endMarker: number) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const playSelection = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = startMarker;
    void audio.play();
    setIsPlaying(true);

    const duration = (endMarker - startMarker) * 1000;
    setTimeout(() => {
      audio.pause();
      audio.currentTime = startMarker;
      setIsPlaying(false);
    }, duration);
  };

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const updateTime = () => {
        if (!audio.paused) {
          setCurrentTime(audio.currentTime);
        }
      };

      const handlePause = () => setIsPlaying(false);

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("pause", handlePause);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("pause", handlePause);
      };
    }
  }, []);

  const handleSliderChange = (value: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value;
      setCurrentTime(value);
    }
  };

  return {
    audioRef,
    currentTime,
    isPlaying,
    toggleAudio,
    playSelection,
    handleSliderChange,
  };
}
