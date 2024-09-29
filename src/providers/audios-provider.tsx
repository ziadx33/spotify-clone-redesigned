"use client";

import { useQueue } from "@/hooks/use-queue";
import { type Track } from "@prisma/client";
import {
  type MutableRefObject,
  type ReactNode,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type AudiosConTextType = {
  data: MutableRefObject<
    | {
        track: Track;
        audio: HTMLAudioElement;
      }[]
    | undefined
  >;
  currentTrackRef: MutableRefObject<HTMLAudioElement | undefined>;
  isLoading: boolean;
  loadTracks: (tracks: Track[]) => Promise<unknown>;
};

export const AudiosContext = createContext<undefined | AudiosConTextType>(
  undefined,
);

export function AudiosProvider({ children }: { children: ReactNode }) {
  const { currentQueue } = useQueue();
  const [isLoading, setIsLoading] = useState(true);
  const currentTrackRef = useRef();
  const loadedTrackList = useRef<AudiosConTextType["data"]["current"]>();
  const doneSettingTracks = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadTracks = async (tracks = currentQueue?.dataTracks?.tracks) => {
    setIsLoading(true);

    const promises =
      tracks?.map((track) => {
        return new Promise<
          NonNullable<AudiosConTextType["data"]["current"]>[number]
        >((res, rej) => {
          const audio = new Audio(track.trackSrc);
          audio.load();
          loadedTrackList.current = loadedTrackList.current ?? [];

          audio.oncanplaythrough = () => {
            res({ track, audio });
          };

          audio.onerror = (error) => {
            rej(error);
          };
        });
      }) ?? [];

    try {
      const data = await Promise.all(promises);
      console.log(data, "shurup motherfucker");
      loadedTrackList.current = data;
      setIsLoading(false);
    } catch (error) {
      console.log("stopp", error);
      throw { error };
    }
  };

  useEffect(() => {
    if (!currentQueue?.dataTracks?.tracks) return;
    if (doneSettingTracks.current) return;
    void loadTracks();
    doneSettingTracks.current = true;
  }, [currentQueue?.dataTracks?.tracks, loadTracks]);

  const content = useMemo(() => {
    return (
      <AudiosContext.Provider
        value={{
          data: loadedTrackList,
          isLoading,
          currentTrackRef,
          loadTracks,
        }}
      >
        {children}
      </AudiosContext.Provider>
    );
  }, [children, isLoading, loadTracks]);

  return content;
}
