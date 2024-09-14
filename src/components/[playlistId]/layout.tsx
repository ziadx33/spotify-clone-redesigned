"use client";

import { type TracksSliceType, setTracks } from "@/state/slices/tracks";
import { type AppDispatch } from "@/state/store";
import { useEffect, useRef, type ReactNode } from "react";
import { useDispatch } from "react-redux";

type PlaylistIdLayoutProps = {
  children: ReactNode;
  id: string;
  tracks: TracksSliceType;
};

export function PlaylistIdLayout({ children, tracks }: PlaylistIdLayoutProps) {
  const dispatch = useDispatch<AppDispatch>();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    dispatch(setTracks(tracks));
    done.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks]);
  return children;
}
