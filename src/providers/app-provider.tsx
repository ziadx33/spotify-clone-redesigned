"use client";

import { setFollowing } from "@/state/slices/following";
import {
  type PlaylistsSliceType,
  setPlaylists,
} from "@/state/slices/playlists";
import { type AppDispatch } from "@/state/store";
import { type User } from "@prisma/client";
import { useEffect, useRef, type ReactNode } from "react";
import { useDispatch } from "react-redux";

type AppProvider = {
  children: ReactNode;
  playlists: PlaylistsSliceType;
  following: User[];
};

export function AppProvider({ children, playlists, following }: AppProvider) {
  const dispatch = useDispatch<AppDispatch>();
  const done = useRef(false);
  useEffect(() => {
    if (!playlists) return;
    if (done.current) return;
    dispatch(setPlaylists(playlists));
    dispatch(setFollowing({ data: following, error: null, status: "success" }));
    done.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlists]);
  return children;
}
