"use client";

import {
  type PlaylistsSliceType,
  setPlaylists,
} from "@/state/slices/playlists";
import { useEffect, useRef, type ReactNode } from "react";
import { useDispatch } from "react-redux";

type AppProvider = {
  children: ReactNode;
  playlists: PlaylistsSliceType;
};

export function AppProvider({ children, playlists }: AppProvider) {
  const dispatch = useDispatch();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    dispatch(setPlaylists(playlists));
    done.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlists]);
  return children;
}
