"use client";

import { useQueue } from "@/hooks/use-queue";
import { editQueueController } from "@/state/slices/queue-controller";
import { type AppDispatch, type RootState } from "@/state/store";
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
import { useDispatch, useSelector } from "react-redux";

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
  const [isLoading, setIsLoading] = useState(false);
  const currentTrackRef = useRef();
  const loadedTrackList = useRef<AudiosConTextType["data"]["current"]>();
  const doneSettingTracks = useRef(false);

  const queueData = useSelector((state: RootState) => state.queueList.data);
  const setCurrentDataDone = useRef(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (setCurrentDataDone.current) return;
    if (!queueData) return;

    dispatch(
      editQueueController({
        progress: currentQueue?.queueData?.currentPlayingProgress ?? 0,
        volume: queueData?.queueList.volumeLevel,
        currentTrackId: currentQueue?.queueData?.currentPlaying,
      }),
    );
    setCurrentDataDone.current = true;
  }, [currentQueue, dispatch, queueData, queueData?.queueList]);

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

          audio.addEventListener("canplay", () => {
            res({ track, audio });
          });

          audio.onerror = (error) => {
            rej(error);
          };
        });
      }) ?? [];

    try {
      const data = await Promise.all(promises);
      loadedTrackList.current = data;
      setIsLoading(false);
    } catch (error) {
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
