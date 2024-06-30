import { type Playlist } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

export type PlaylistsSliceType =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: Playlist[]; error: null }
  | { status: "error"; data: null; error: string };

const initialState: PlaylistsSliceType = {
  status: "loading",
  data: null,
  error: null,
};

const playlistsSlice = createSlice({
  name: "playlists",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as PlaylistsSliceType,
  reducers: {
    setPlaylists(state, { payload }: { payload: PlaylistsSliceType }) {
      state.status = payload.status;
      state.error = payload.error;
      state.data = payload.data;
    },
    removePlaylist(state, { payload }: { payload: string }) {
      state.data =
        state.data?.filter((playlist) => playlist.id !== payload) ?? state.data;
    },
    addPlaylist(state, { payload }: { payload: Playlist }) {
      state.data = state.data ? [...state.data, payload] : state.data;
    },
  },
});

export const { setPlaylists, addPlaylist, removePlaylist } =
  playlistsSlice.actions;

export default playlistsSlice.reducer;
